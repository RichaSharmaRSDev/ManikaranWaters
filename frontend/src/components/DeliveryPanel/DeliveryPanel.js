import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  IconCircleCheckFilled,
  IconPhone,
  IconRosetteDiscountCheckFilled,
  IconLogout,
  IconPlayerPlay,
  IconFlagCheck,
} from "@tabler/icons-react";
import Title from "../layout/Title";
import { getTripsByDateAndDeliveryGuy, getAllDeliveryGuyName, clearTripData } from "../../actions/tripsAction";
import { createDelivery } from "../../actions/deliveryAction";
import { logout } from "../../actions/userAction";
import { todayIST } from "../../utils/istDate";
import filledJarLarge from "../../assets/filledJarLarge.png";
import emptyJarLarge from "../../assets/emptyJarLarge.png";
import "./DeliveryPanel.scss";

// TODO: backend now supports deliveryNote (new) and qtyOverride (new) fields on
// customer objects saved inside trips. deliveryNote falls back to customMessage
// for older trips. qtyOverride falls back to allotment if not set.

// ── Copied from Dashboard/dash.js — do not rewrite ───────────────────
const getGreeting = () => {
  const hour = parseInt(
    new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hour12: false,
    }),
    10
  );
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const todayDisplay = new Date()
  .toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  .replace(/,/g, "");
// ─────────────────────────────────────────────────────────────────────

const TODAY_DATE = todayIST();

// ── Shared: customer card ─────────────────────────────────────────────
// isReadOnly=true: no onClick, no chevron, no expand form
function renderCustomerCard(customer, isReadOnly, ctx = {}) {
  const { expandedId, onCardTap, formValues, setFormValues, onSubmit, onCancel, bigName } = ctx;
  const isExpanded = !isReadOnly && expandedId === customer.customerId;
  const isDelivered = customer.isDelivered;
  // deliveryNote (new) falls back to customMessage (old) for backward compat
  const note = customer.deliveryNote || customer.customMessage || null;
  const couponBalance = customer.couponBalance ?? 0;

  return (
    <div key={customer.customerId} className="dp-customer">
      <div
        className={[
          "dp-card",
          isDelivered ? "dp-card--delivered" : "",
          isExpanded ? "dp-card--expanded" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={isReadOnly ? undefined : () => onCardTap(customer)}
        style={isReadOnly ? { cursor: "default" } : undefined}
      >
        <div className="dp-card__body">
          <div className={bigName ? "dp-card__name dp-card__name--big" : "dp-card__name"}>
            {customer.name}
            {couponBalance !== 0 && (
              <span className={`dp-coupon-badge${couponBalance < 0 ? " dp-coupon-badge--negative" : ""}`}>
                🎫 {couponBalance}
              </span>
            )}
          </div>
          {isDelivered ? (
            <div className="dp-card__summary">
              ✓ {customer.deliveredCans} delivered
              {customer.returnedCans > 0 &&
                ` · ↩ ${customer.returnedCans} returned`}
              {customer.cashReceived > 0 && ` · ₹${customer.cashReceived}`}
              {customer.deliveryPaymentMode === "coupon" && " · 🎫 coupon"}
            </div>
          ) : (
            <div className="dp-card__meta">
              <span>{customer.address}</span>
              {customer.phoneNo && (
                <a
                  className="dp-card__phone"
                  href={`tel:${customer.phoneNo}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconPhone size={13} stroke={1.8} />
                  {customer.phoneNo}
                </a>
              )}
            </div>
          )}
        </div>

        <div className="dp-card__right">
          <span className="dp-allotment-badge">
            {customer.qtyOverride ?? customer.allotment}
          </span>
          {!isReadOnly && (
            <span
              className={[
                "dp-chevron",
                isExpanded ? "dp-chevron--up" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              ▼
            </span>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="dp-expanded">
          {isDelivered && (
            <div className="dp-editing-tag">✎ Editing delivery</div>
          )}
          {note && <div className="dp-note">{note}</div>}

          <div className="dp-form-row">
            <div className="dp-form-field">
              <label className="dp-form-label">Delivered</label>
              <input
                type="number"
                className="dp-form-input"
                value={formValues.delivered}
                onChange={(e) =>
                  setFormValues((v) => ({
                    ...v,
                    delivered: e.target.value,
                    couponsCollected: v.paymentMode === "coupon" ? e.target.value : v.couponsCollected,
                  }))
                }
              />
            </div>
            <div className="dp-form-field">
              <label className="dp-form-label">Returned</label>
              <input
                type="number"
                className="dp-form-input"
                value={formValues.returned}
                placeholder="0"
                onChange={(e) =>
                  setFormValues((v) => ({ ...v, returned: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="dp-form-row dp-form-row--payment">
            <div className="dp-form-field dp-form-field--mode">
              <label className="dp-form-label">Payment</label>
              <div className="dp-payment-mode-group">
                {["none", "cash", "coupon"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`dp-mode-btn${formValues.paymentMode === mode ? " dp-mode-btn--active" : ""}`}
                    onClick={() =>
                      setFormValues((v) => ({
                        ...v,
                        paymentMode: mode,
                        amount: mode === "coupon" ? "" : v.amount,
                        couponsCollected: mode === "coupon" ? v.delivered : v.couponsCollected,
                      }))
                    }
                  >
                    {mode === "none" ? "None" : mode === "cash" ? "Cash" : "🎫 Coupon"}
                  </button>
                ))}
              </div>
            </div>
            {formValues.paymentMode === "cash" && (
              <div className="dp-form-field">
                <label className="dp-form-label">Amount ₹</label>
                <input
                  type="number"
                  className="dp-form-input"
                  value={formValues.amount}
                  placeholder="0"
                  onChange={(e) =>
                    setFormValues((v) => ({ ...v, amount: e.target.value }))
                  }
                />
              </div>
            )}
            {formValues.paymentMode === "coupon" && (
              <div className="dp-form-field">
                <label className="dp-form-label">Coupons Collected</label>
                <input
                  type="number"
                  className="dp-form-input"
                  value={formValues.couponsCollected}
                  min="0"
                  onChange={(e) =>
                    setFormValues((v) => ({ ...v, couponsCollected: e.target.value }))
                  }
                />
              </div>
            )}
          </div>

          <div className="dp-form-actions">
            <button
              className={`dp-btn-deliver${isDelivered ? " dp-btn-deliver--update" : ""}`}
              onClick={() => onSubmit(customer)}
            >
              <IconCircleCheckFilled size={16} />
              {isDelivered ? "Update" : "Mark Delivered"}
            </button>
            <button className="dp-btn-cancel" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Shared: trip pills ────────────────────────────────────────────────
function TripPills({ trips, activeTripIndex, onSelect, loading, light }) {
  const isTripComplete = (trip) =>
    trip.customers.length > 0 && trip.customers.every((c) => c.isDelivered);

  return (
    <div
      className={[
        "dp-trips-scroll",
        light ? "dp-trips-scroll--light" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading && !trips?.length ? (
        <span className="dp-trips-loading">Loading…</span>
      ) : (
        (trips || []).map((trip, index) => {
          const done = trip.customers.filter((c) => c.isDelivered).length;
          const total = trip.customers.length;
          const complete = isTripComplete(trip);
          const isActive = index === activeTripIndex;
          return (
            <button
              key={trip.tripNumber}
              className={[
                "dp-trip-pill",
                isActive ? "dp-trip-pill--active" : "",
                complete && !isActive ? "dp-trip-pill--done" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onSelect(index)}
            >
              {trip.tripNumber.replace("trip", "Trip ")} ·{" "}
              <span className="dp-trip-pill__count">
                {done}/{total}
              </span>
            </button>
          );
        })
      )}
    </div>
  );
}

// ── Shared: progress bar ──────────────────────────────────────────────
function ProgressBar({ customers }) {
  const deliveredCount = customers.filter((c) => c.isDelivered).length;
  const totalCount = customers.length;
  const progress = totalCount ? (deliveredCount / totalCount) * 100 : 0;

  if (!totalCount) return null;

  return (
    <div className="dp-progress">
      <div className="dp-progress__labels">
        <span>Trip progress</span>
        <span>
          {deliveredCount} of {totalCount} delivered
        </span>
      </div>
      <div className="dp-progress__track">
        <div
          className="dp-progress__fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ── Delivery role view ────────────────────────────────────────────────
const DeliveryView = ({ deliveryGuyName }) => {
  const dispatch = useDispatch();
  const { tripsByDateAndDeliveryGuy, tripsByDateAndDeliveryGuyLoading } =
    useSelector((state) => state.trips || {});

  const [activeTripIndex, setActiveTripIndex] = useState(null);
  const [tripCustomers, setTripCustomers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [formValues, setFormValues] = useState({ delivered: "", returned: "", amount: "", paymentMode: "none", couponsCollected: "" });
  const [flash, setFlash] = useState(null);

  // Trip lifecycle
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [startJars, setStartJars] = useState("");
  const [endJarsEmpty, setEndJarsEmpty] = useState("");
  const [endJarsFilled, setEndJarsFilled] = useState("");
  const [lifecycleLoading, setLifecycleLoading] = useState(false);

  useEffect(() => {
    dispatch(clearTripData());
    dispatch(getTripsByDateAndDeliveryGuy(TODAY_DATE, deliveryGuyName));
  }, []);

  // Auto-select first incomplete trip; reset local state when trips are cleared
  useEffect(() => {
    if (!tripsByDateAndDeliveryGuy?.length) {
      setActiveTripIndex(null);
      setTripCustomers([]);
      return;
    }
    if (activeTripIndex !== null) return;
    const firstIncompleteIndex = tripsByDateAndDeliveryGuy.findIndex(
      (t) => !t.customers.every((c) => c.isDelivered)
    );
    const index = firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0;
    setActiveTripIndex(index);
    setTripCustomers(tripsByDateAndDeliveryGuy[index].customers);
  }, [tripsByDateAndDeliveryGuy]);

  const handleTripSelect = (index) => {
    const trip = (tripsByDateAndDeliveryGuy || [])[index];
    if (!trip) return;
    setActiveTripIndex(index);
    setTripCustomers(trip.customers);
    setExpandedId(null);
  };

  const handleCardTap = (customer) => {
    if (expandedId === customer.customerId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(customer.customerId);
    // qtyOverride (new field) falls back to allotment for pre-fill
    const qty = customer.qtyOverride ?? customer.allotment ?? "";
    const deliveredVal = customer.isDelivered ? (customer.deliveredCans ?? "") : qty;
    setFormValues({
      delivered: deliveredVal,
      returned: customer.isDelivered ? (customer.returnedCans ?? "") : "",
      amount: customer.isDelivered ? (customer.cashReceived ?? "") : "",
      paymentMode: customer.isDelivered ? (customer.deliveryPaymentMode ?? "none") : "none",
      couponsCollected: deliveredVal,
    });
  };

  const submitDelivery = async (customer) => {
    const qty = parseInt(formValues.delivered, 10);
    if (!qty) return;

    const isUpdate = customer.isDelivered;
    const returnedNum = parseInt(formValues.returned, 10) || 0;
    const amtNum = parseInt(formValues.amount, 10) || 0;
    const selectedMode = formValues.paymentMode || "none";

    const deliveryData = {
      customerId: customer.customerId,
      deliveredQuantity: qty,
      deliveryAssociateName: deliveryGuyName,
      deliveryDate: TODAY_DATE,
      returnedJars: returnedNum,
    };
    if (selectedMode === "coupon") {
      deliveryData.paymentMode = "coupon";
      deliveryData.couponsCollected = parseInt(formValues.couponsCollected, 10) || qty;
    } else if (selectedMode === "cash" && amtNum > 0) {
      deliveryData.amountReceived = amtNum;
      deliveryData.paymentMode = "cash";
    }

    // createDelivery action kept exactly as-is
    dispatch(createDelivery(deliveryData))
      .then(async () => {
        const updatedCustomers = tripCustomers.map((c) =>
          c.customerId === customer.customerId
            ? {
                ...c,
                isDelivered: true,
                deliveredCans: qty,
                returnedCans: returnedNum,
                ...(selectedMode === "cash" && amtNum > 0 && { cashReceived: amtNum }),
                deliveryPaymentMode: selectedMode !== "none" ? selectedMode : undefined,
              }
            : c
        );

        setTripCustomers(updatedCustomers);
        setExpandedId(null);
        setFlash(isUpdate ? "updated" : "recorded");
        setTimeout(() => setFlash(null), 1500);

        const activeTrip = (tripsByDateAndDeliveryGuy || [])[activeTripIndex];
        if (!activeTrip) return;

        // overwrite-trip fetch kept exactly as existing DeliveryPanel logic
        const tripData = {
          tripDate: TODAY_DATE,
          tripNumber: activeTrip.tripNumber,
          deliveryGuy: deliveryGuyName,
          customers: updatedCustomers,
        };
        try {
          const res = await fetch(
            `/api/v1/trips/overwrite-trip/${TODAY_DATE}/${activeTrip.tripNumber}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(tripData),
            }
          );
          if (res.ok) {
            dispatch(getTripsByDateAndDeliveryGuy(TODAY_DATE, deliveryGuyName));
          } else {
            console.error("Failed to update trip");
          }
        } catch (err) {
          console.error("Error updating trip:", err);
        }

        // Auto-advance: when all customers delivered, switch to next incomplete trip
        const allDone = updatedCustomers.every((c) => c.isDelivered);
        if (allDone && tripsByDateAndDeliveryGuy) {
          const nextIndex = tripsByDateAndDeliveryGuy.findIndex(
            (t, i) =>
              i !== activeTripIndex && !t.customers.every((c) => c.isDelivered)
          );
          if (nextIndex >= 0) {
            setTimeout(() => {
              setActiveTripIndex(nextIndex);
              setTripCustomers(tripsByDateAndDeliveryGuy[nextIndex].customers);
            }, 1600);
          }
        }
      })
      .catch((err) => console.error("Delivery error:", err));
  };

  const handleStartTrip = async () => {
    const jars = parseInt(startJars, 10);
    if (!jars) return;
    const activeTrip = (tripsByDateAndDeliveryGuy || [])[activeTripIndex];
    if (!activeTrip) return;
    setLifecycleLoading(true);
    try {
      const res = await fetch(
        `/api/v1/trips/start/${TODAY_DATE}/${activeTrip.tripNumber}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filledJarsTaken: jars }),
        }
      );
      if (res.ok) {
        setShowStartModal(false);
        setStartJars("");
        dispatch(getTripsByDateAndDeliveryGuy(TODAY_DATE, deliveryGuyName));
      }
    } finally {
      setLifecycleLoading(false);
    }
  };

  const handleEndTrip = async () => {
    const activeTrip = (tripsByDateAndDeliveryGuy || [])[activeTripIndex];
    if (!activeTrip) return;
    setLifecycleLoading(true);
    try {
      const res = await fetch(
        `/api/v1/trips/end/${TODAY_DATE}/${activeTrip.tripNumber}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emptyJarsReturned: parseInt(endJarsEmpty, 10) || 0,
            filledJarsReturned: parseInt(endJarsFilled, 10) || 0,
          }),
        }
      );
      if (res.ok) {
        setShowEndModal(false);
        setEndJarsEmpty("");
        setEndJarsFilled("");
        dispatch(getTripsByDateAndDeliveryGuy(TODAY_DATE, deliveryGuyName));
      }
    } finally {
      setLifecycleLoading(false);
    }
  };

  // Pending first, delivered pushed to bottom
  const sortedCustomers = [...tripCustomers].sort((a, b) => {
    if (a.isDelivered && !b.isDelivered) return 1;
    if (!a.isDelivered && b.isDelivered) return -1;
    return 0;
  });

  const activeTripComplete =
    tripCustomers.length > 0 && tripCustomers.every((c) => c.isDelivered);

  const jarTotal = tripCustomers.reduce(
    (sum, c) => sum + (c.qtyOverride ?? c.allotment ?? 0),
    0
  );

  const activeTrip = (tripsByDateAndDeliveryGuy || [])[activeTripIndex];
  const tripStatus = activeTrip?.tripStatus || "pending";
  const tripStarted = tripStatus === "started" || tripStatus === "ended";
  const tripEnded = tripStatus === "ended";

  return (
    <>
      <Title title="Delivery Panel" />

      {flash && (
        <div className="dp-flash">
          <div className="dp-flash__icon">
            <IconRosetteDiscountCheckFilled size={64} color="#fff" />
          </div>
          <div className="dp-flash__text">
            {flash === "updated" ? "Delivery updated" : "Delivery recorded"}
          </div>
        </div>
      )}

      {showStartModal && (
        <div className="dp-modal-overlay" onClick={() => setShowStartModal(false)}>
          <div className="dp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dp-modal__title">
              Starting {activeTrip?.tripNumber.replace("trip", "Trip ")}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "12px 0" }}>
              <img src={filledJarLarge} alt="filled jar" style={{ width: "50px", height: "50px" }} />
              <input
                type="number"
                className="dp-form-input dp-modal__input"
                style={{ margin: 0 }}
                value={startJars}
                onChange={(e) => setStartJars(e.target.value)}
                placeholder="0"
                autoFocus
              />
            </div>
            <button
              className="dp-btn-deliver"
              onClick={handleStartTrip}
              disabled={!startJars || lifecycleLoading}
            >
              <IconPlayerPlay size={16} />
              {lifecycleLoading ? "Starting…" : "Start Trip"}
            </button>
          </div>
        </div>
      )}

      {showEndModal && (
        <div className="dp-modal-overlay" onClick={() => setShowEndModal(false)}>
          <div className="dp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dp-modal__title">
              Ending {activeTrip?.tripNumber.replace("trip", "Trip ")}
            </div>
            <div className="dp-form-row">
              <div className="dp-form-field">
                <label className="dp-form-label"><img src={emptyJarLarge} alt="empty jars returned" style={{ width: "32px", height: "32px" }} /></label>
                <input
                  type="number"
                  className="dp-form-input"
                  value={endJarsEmpty}
                  placeholder="0"
                  onChange={(e) => setEndJarsEmpty(e.target.value)}
                />
              </div>
              <div className="dp-form-field">
                <label className="dp-form-label"><img src={filledJarLarge} alt="filled jars returned" style={{ width: "32px", height: "32px" }} /></label>
                <input
                  type="number"
                  className="dp-form-input"
                  value={endJarsFilled}
                  placeholder="0"
                  onChange={(e) => setEndJarsFilled(e.target.value)}
                />
              </div>
            </div>
            <button
              className="dp-btn-deliver dp-btn-deliver--danger"
              onClick={handleEndTrip}
              disabled={lifecycleLoading}
            >
              <IconFlagCheck size={16} />
              {lifecycleLoading ? "Ending…" : "End Trip"}
            </button>
          </div>
        </div>
      )}

      <div className="dp-root">
        <header className="dp-header">
          <div className="dp-header__row1">
            <span className="dp-header__greeting">
              {getGreeting()}, {deliveryGuyName} 👋🏽
            </span>
            <button
              className="dp-logout-btn"
              onClick={() => dispatch(logout())}
              title="Logout"
            >
              <IconLogout size={18} />
            </button>
          </div>

          <div className="dp-header__row2">
            <span className="dp-header__date">{todayDisplay}</span>
          </div>

          <div className="dp-header__row3">
            <TripPills
              trips={tripsByDateAndDeliveryGuy}
              activeTripIndex={activeTripIndex ?? 0}
              onSelect={handleTripSelect}
              loading={tripsByDateAndDeliveryGuyLoading}
            />
            {jarTotal > 0 && (
              <span className="dp-jar-pill">
                <img src={filledJarLarge} alt="" className="dp-jar-pill__icon" />
                {jarTotal}
              </span>
            )}
          </div>
        </header>

        {tripStarted && <ProgressBar customers={tripCustomers} />}

        <div className="dp-list">
          {!tripsByDateAndDeliveryGuy?.length ? (
            <div className="dp-empty-state">
              <span className="dp-empty-state__emoji">🗓</span>
              <span className="dp-empty-state__text">No trips for today</span>
            </div>
          ) : !tripStarted ? (
            <div className="dp-gate">
              <div className="dp-gate__trip-name">
                {activeTrip?.tripNumber.replace("trip", "Trip ")}
              </div>
              <div className="dp-gate__subtitle">
                {activeTrip?.customers?.length} customers · {jarTotal} jars
              </div>
              <button
                className="dp-gate__btn"
                onClick={() => setShowStartModal(true)}
              >
                <IconPlayerPlay size={20} />
                Start Trip
              </button>
            </div>
          ) : (
            <>
              {activeTripComplete && tripEnded && (
                <div className="dp-all-done">All deliveries completed 🎉</div>
              )}
              {sortedCustomers.map((customer) =>
                renderCustomerCard(customer, false, {
                  expandedId,
                  onCardTap: handleCardTap,
                  formValues,
                  setFormValues,
                  onSubmit: submitDelivery,
                  onCancel: () => setExpandedId(null),
                  bigName: true,
                })
              )}
              {tripEnded ? (
                <div className="dp-trip-ended-banner">
                  <IconFlagCheck size={18} />
                  Trip ended
                </div>
              ) : (
                <button
                  className="dp-end-trip-btn"
                  onClick={() => setShowEndModal(true)}
                >
                  <IconFlagCheck size={16} />
                  End Trip
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

// ── Admin / User role view ────────────────────────────────────────────
const AdminUserView = () => {
  const dispatch = useDispatch();
  const { tripsByDateAndDeliveryGuy, tripsByDateAndDeliveryGuyLoading, deliveryGuyNames } =
    useSelector((state) => state.trips || {});

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState(TODAY_DATE);
  const [activeTripIndex, setActiveTripIndex] = useState(0);
  const [tripCustomers, setTripCustomers] = useState([]);

  useEffect(() => {
    dispatch(getAllDeliveryGuyName());
  }, []);

  // Default to first staff member
  useEffect(() => {
    if (deliveryGuyNames?.length && selectedStaff === null) {
      setSelectedStaff(deliveryGuyNames[0].name);
    }
  }, [deliveryGuyNames]);

  // Fetch when staff or date changes
  useEffect(() => {
    if (selectedStaff) {
      dispatch(getTripsByDateAndDeliveryGuy(selectedDate, selectedStaff));
      setActiveTripIndex(0);
    }
  }, [selectedStaff, selectedDate]);

  // Sync customers with active trip
  useEffect(() => {
    if (tripsByDateAndDeliveryGuy?.length > 0) {
      setTripCustomers(tripsByDateAndDeliveryGuy[activeTripIndex]?.customers || []);
    } else {
      setTripCustomers([]);
    }
  }, [tripsByDateAndDeliveryGuy, activeTripIndex]);

  // Pending first, delivered pushed to bottom
  const sortedCustomers = [...tripCustomers].sort((a, b) => {
    if (a.isDelivered && !b.isDelivered) return 1;
    if (!a.isDelivered && b.isDelivered) return -1;
    return 0;
  });

  const activeTrip = tripsByDateAndDeliveryGuy?.[activeTripIndex];
  const tripInfo =
    activeTrip?.tripStatus === "started" || activeTrip?.tripStatus === "ended"
      ? activeTrip
      : null;

  return (
    <>
      <Title title="Delivery Panel" />
      <div className="dp-admin-root">
        <div className="dp-admin-sticky">
          <div className="dp-admin-topbar">
            {/* Mobile: native dropdown */}
            <select
              className="dp-staff-select"
              value={selectedStaff || ""}
              onChange={(e) => setSelectedStaff(e.target.value)}
            >
              {(deliveryGuyNames || []).map((guy) => (
                <option key={guy.name} value={guy.name}>{guy.name}</option>
              ))}
            </select>

            {/* Desktop: tab pills */}
            <div className="dp-staff-tabs">
              {(deliveryGuyNames || []).map((guy) => {
                const name = guy.name;
                return (
                  <button
                    key={name}
                    className={[
                      "dp-staff-tab",
                      selectedStaff === name ? "dp-staff-tab--active" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => setSelectedStaff(name)}
                  >
                    {name}
                  </button>
                );
              })}
            </div>

            <input
              type="date"
              value={selectedDate}
              max={TODAY_DATE}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="dp-datepicker"
            />
          </div>

          {tripsByDateAndDeliveryGuy?.length > 0 && (
            <div className="dp-admin-trips-section">
              <TripPills
                trips={tripsByDateAndDeliveryGuy}
                activeTripIndex={activeTripIndex}
                onSelect={setActiveTripIndex}
                loading={tripsByDateAndDeliveryGuyLoading}
                light
              />
            </div>
          )}

          {tripInfo && (
            <div className={`dp-trip-info-banner dp-trip-info-banner--${tripInfo.tripStatus}`}>
              <div className="dp-trip-info-banner__stat">
                <span className="dp-trip-info-banner__label">Status</span>
                <span className="dp-trip-info-banner__value">
                  {tripInfo.tripStatus === "started" ? "In Progress" : "Ended"}
                </span>
              </div>
              {tripInfo.filledJarsTaken != null && (
                <div className="dp-trip-info-banner__stat">
                  <span className="dp-trip-info-banner__label">Taken</span>
                  <span className="dp-trip-info-banner__value">{tripInfo.filledJarsTaken} filled</span>
                </div>
              )}
              {tripInfo.tripStatus === "ended" && tripInfo.emptyJarsReturned != null && (
                <div className="dp-trip-info-banner__stat">
                  <span className="dp-trip-info-banner__label">Empty back</span>
                  <span className="dp-trip-info-banner__value">{tripInfo.emptyJarsReturned}</span>
                </div>
              )}
              {tripInfo.tripStatus === "ended" && tripInfo.filledJarsReturned != null && (
                <div className="dp-trip-info-banner__stat">
                  <span className="dp-trip-info-banner__label">Filled back</span>
                  <span className="dp-trip-info-banner__value">{tripInfo.filledJarsReturned}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <ProgressBar customers={tripCustomers} />

        <div className="dp-list dp-list--page">
          {tripsByDateAndDeliveryGuyLoading ? (
            <div className="dp-empty">Loading…</div>
          ) : !tripsByDateAndDeliveryGuy?.length ? (
            <div className="dp-empty">
              No trips found for {selectedStaff} on this date.
            </div>
          ) : !tripCustomers.length ? (
            <div className="dp-empty">Select a trip above.</div>
          ) : (
            sortedCustomers.map((customer) => renderCustomerCard(customer, true))
          )}
        </div>
      </div>
    </>
  );
};

// ── Root ──────────────────────────────────────────────────────────────
const DeliveryPanel = () => {
  const { user } = useSelector((state) => state.user);
  const role = user?.role;

  if (role === "delivery") {
    return <DeliveryView deliveryGuyName={user.name} />;
  }
  return <AdminUserView />;
};

export default DeliveryPanel;
