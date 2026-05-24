import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IconCircleCheckFilled, IconPhone, IconRosetteDiscountCheckFilled } from "@tabler/icons-react";
import Title from "../layout/Title";
import { getTripsByDateAndDeliveryGuy } from "../../actions/tripsAction";
import { createDelivery } from "../../actions/deliveryAction";
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

const formatDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const date = formatDate(new Date());

const initials = (name) =>
  (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const DeliveryPanel = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { tripsByDateAndDeliveryGuy, tripsByDateAndDeliveryGuyLoading } =
    useSelector((state) => state.trips || {});

  const deliveryGuyName = user.name;

  const [activeTrip, setActiveTrip] = useState(null);
  const [tripCustomers, setTripCustomers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [formValues, setFormValues] = useState({ delivered: "", returned: "", amount: "" });
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    dispatch(getTripsByDateAndDeliveryGuy(date, deliveryGuyName));
  }, []);

  // Auto-select first incomplete trip on load
  useEffect(() => {
    if (!tripsByDateAndDeliveryGuy?.length) return;
    if (activeTrip) return; 
    const firstIncomplete = tripsByDateAndDeliveryGuy.find(
      (t) => !t.customers.every((c) => c.isDelivered)
    );
    const trip = firstIncomplete || tripsByDateAndDeliveryGuy[0];
    setActiveTrip(trip.tripNumber);
    setTripCustomers(trip.customers);
  }, [tripsByDateAndDeliveryGuy]);

  const handleTripSelect = (tripNumber) => {
    const trip = (tripsByDateAndDeliveryGuy || []).find(
      (t) => t.tripNumber === tripNumber
    );
    if (!trip) return;
    setActiveTrip(tripNumber);
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
    setFormValues({
      delivered: customer.isDelivered ? (customer.deliveredCans ?? "") : qty,
      returned: customer.isDelivered ? (customer.returnedCans ?? "") : "",
      amount: customer.isDelivered ? (customer.cashReceived ?? "") : "",
    });
  };

  const submitDelivery = async (customer) => {
    const qty = parseInt(formValues.delivered, 10);
    if (!qty) return;

    const isUpdate = customer.isDelivered;
    const returnedNum = parseInt(formValues.returned, 10) || 0;
    const amtNum = parseInt(formValues.amount, 10) || 0;

    const deliveryData = {
      customerId: customer.customerId,
      deliveredQuantity: qty,
      deliveryAssociateName: deliveryGuyName,
      deliveryDate: date,
      returnedJars: returnedNum,
    };
    if (amtNum > 0) {
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
                ...(amtNum > 0 && { cashReceived: amtNum }),
              }
            : c
        );

        setTripCustomers(updatedCustomers);
        setExpandedId(null);
        setFlash(isUpdate ? "updated" : "recorded");
        setTimeout(() => setFlash(null), 1500);

        // overwrite-trip fetch kept exactly as existing DeliveryPanel logic
        const tripData = {
          tripDate: date,
          tripNumber: activeTrip,
          deliveryGuy: deliveryGuyName,
          customers: updatedCustomers,
        };
        try {
          const res = await fetch(
            `/api/v1/trips/overwrite-trip/${date}/${activeTrip}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(tripData),
            }
          );
          if (res.ok) {
            dispatch(getTripsByDateAndDeliveryGuy(date, deliveryGuyName));
          } else {
            console.error("Failed to update trip");
          }
        } catch (err) {
          console.error("Error updating trip:", err);
        }

        // Auto-advance: when all customers delivered, switch to next incomplete trip
        const allDone = updatedCustomers.every((c) => c.isDelivered);
        if (allDone && tripsByDateAndDeliveryGuy) {
          const nextTrip = tripsByDateAndDeliveryGuy.find(
            (t) =>
              t.tripNumber !== activeTrip &&
              !t.customers.every((c) => c.isDelivered)
          );
          if (nextTrip) {
            setTimeout(() => {
              setActiveTrip(nextTrip.tripNumber);
              setTripCustomers(nextTrip.customers);
            }, 1600);
          }
        }
      })
      .catch((err) => console.error("Delivery error:", err));
  };

  const isTripComplete = (trip) =>
    trip.customers.length > 0 && trip.customers.every((c) => c.isDelivered);

  // Pending first, delivered pushed to bottom
  const sortedCustomers = [...tripCustomers].sort((a, b) => {
    if (a.isDelivered && !b.isDelivered) return 1;
    if (!a.isDelivered && b.isDelivered) return -1;
    return 0;
  });

  const deliveredCount = tripCustomers.filter((c) => c.isDelivered).length;
  const totalCount = tripCustomers.length;
  const progress = totalCount ? (deliveredCount / totalCount) * 100 : 0;

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

      <div className="dp-root">
        <header className="dp-header">
          <div className="dp-header__top">
            <span className="dp-header__greeting">
              {getGreeting()} · <span className="dp-header__name">{deliveryGuyName}</span>
            </span>
            <span className="dp-header__date">{todayDisplay}</span>
          </div>

          <div className="dp-trips-scroll">
            {tripsByDateAndDeliveryGuyLoading && !tripsByDateAndDeliveryGuy?.length ? (
              <span className="dp-trips-loading">Loading…</span>
            ) : (
              (tripsByDateAndDeliveryGuy || []).map((trip) => {
                const done = trip.customers.filter((c) => c.isDelivered).length;
                const total = trip.customers.length;
                const complete = isTripComplete(trip);
                const isActive = trip.tripNumber === activeTrip;
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
                    onClick={() => handleTripSelect(trip.tripNumber)}
                  >
                    {trip.tripNumber.replace("trip", "Trip ")} · <span className="dp-trip-pill__count">{done}/{total}</span>
                  </button>
                );
              })
            )}
          </div>
        </header>

        {totalCount > 0 && (
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
        )}

        <div className="dp-list">
          {!tripsByDateAndDeliveryGuy?.length ? (
            <div className="dp-empty">No trips assigned for today.</div>
          ) : !totalCount ? (
            <div className="dp-empty">Select a trip above.</div>
          ) : (
            sortedCustomers.map((customer) => {
              const isExpanded = expandedId === customer.customerId;
              const isDelivered = customer.isDelivered;
              // deliveryNote (new) falls back to customMessage (old) for backward compat
              const note = customer.deliveryNote || customer.customMessage || null;

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
                    onClick={() => handleCardTap(customer)}
                  >
                    <div className="dp-card__body">
                      <div className="dp-card__name">{customer.name}</div>
                      {isDelivered ? (
                        <div className="dp-card__summary">
                          ✓ {customer.deliveredCans} delivered
                          {customer.returnedCans > 0 &&
                            ` · ↩ ${customer.returnedCans} returned`}
                          {customer.cashReceived > 0 &&
                            ` · ₹${customer.cashReceived}`}
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
                              setFormValues((v) => ({
                                ...v,
                                returned: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="dp-form-field">
                          <label className="dp-form-label">Amount ₹</label>
                          <input
                            type="number"
                            className="dp-form-input"
                            value={formValues.amount}
                            placeholder="0"
                            onChange={(e) =>
                              setFormValues((v) => ({
                                ...v,
                                amount: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="dp-form-actions">
                        <button
                          className={`dp-btn-deliver${isDelivered ? " dp-btn-deliver--update" : ""}`}
                          onClick={() => submitDelivery(customer)}
                        >
                          <IconCircleCheckFilled size={16} />
                          {isDelivered ? "Update" : "Mark Delivered"}
                        </button>
                        <button
                          className="dp-btn-cancel"
                          onClick={() => setExpandedId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default DeliveryPanel;
