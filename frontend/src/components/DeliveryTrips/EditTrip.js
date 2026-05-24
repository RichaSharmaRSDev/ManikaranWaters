import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Loader from "../layout/Loader/Loader";
import { todayIST } from "../../utils/istDate";
import { getTripsByDate } from "../../actions/tripsAction";
import { getCustomersIdName } from "../../actions/customerAction";
import Alert from "../layout/Alert/Alert";
import filledJar from "../../assets/filledJar.png";
import {
  IconGripVertical,
  IconTrash,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
} from "@tabler/icons-react";

// ── Sortable desktop row ─────────────────────────────────────────────
const SortableRow = ({ customer, index, onUpdate, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: customer.customerId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    position: "relative",
    zIndex: isDragging ? 1 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} className="edittrip-row">
      <div className="et-drag" {...listeners} {...attributes} style={{ cursor: isDragging ? "grabbing" : "grab" }}>
        <IconGripVertical size={14} color="#bbb" />
      </div>
      <div className="et-num">{index + 1}</div>
      <div className="et-id">{customer.customerId}</div>
      <div className="et-name">{customer.name}</div>
      <div className="et-allot">{customer.allotment}</div>
      <div className="et-qty">
        <input
          type="number"
          min={1}
          placeholder={customer.allotment}
          value={customer.qtyOverride ?? ""}
          onChange={(e) =>
            onUpdate(index, "qtyOverride", e.target.value ? Number(e.target.value) : null)
          }
        />
      </div>
      <div className="et-note">
        <input
          type="text"
          placeholder="Note…"
          value={customer.deliveryNote ?? ""}
          onChange={(e) => onUpdate(index, "deliveryNote", e.target.value)}
        />
      </div>
      <div className="et-actions">
        <button className="edittrip-delete" onClick={() => onRemove(index)}>
          <IconTrash size={14} />
        </button>
      </div>
    </div>
  );
};

// ── Sortable mobile card ─────────────────────────────────────────────
const SortableCard = ({ customer, index, onUpdate, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: customer.customerId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    position: "relative",
    zIndex: isDragging ? 1 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="et-card">
      <span className="et-card-num">{index + 1}</span>
      <div className="et-card-center">
        <div className="et-card-name">{customer.name}</div>
        <div className="et-card-meta">
          {customer.customerId} &middot; <strong>{customer.allotment} jars</strong>
        </div>
      </div>
      <div className="et-card-right">
        <input
          type="number"
          className="et-card-qty"
          min={1}
          placeholder={customer.allotment}
          value={customer.qtyOverride ?? ""}
          onPointerDown={(e) => e.stopPropagation()}
          onChange={(e) =>
            onUpdate(index, "qtyOverride", e.target.value ? Number(e.target.value) : null)
          }
        />
        <button
          className="edittrip-delete"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onRemove(index)}
        >
          <IconTrash size={14} />
        </button>
      </div>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────
const EditTrip = ({ onSwitchTab }) => {
  const dispatch = useDispatch();
  const { tripsByDate, tripsByDateLoading } = useSelector((state) => state.trips || {});
  const { customersIdName } = useSelector((state) => state.customers || {});

  const [selectedDate, setSelectedDate] = useState(todayIST());
  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [alert, setAlert] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  const dropdownRef = useRef(null);

  const currentTrip = tripsByDate?.[currentTripIndex];

  const jarTotal = customers.reduce(
    (sum, c) => sum + (c.qtyOverride ?? c.allotment ?? 0),
    0
  );

  const filteredCustomers = (customersIdName || []).filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.customerId?.toLowerCase().includes(q)
    );
  }).slice(0, 8);

  const displayValue = selectedCustomer
    ? `${selectedCustomer.name} | ${selectedCustomer.customerId}`
    : searchQuery;

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(getTripsByDate(selectedDate));
    setCurrentTripIndex(0);
  }, [selectedDate]);

  useEffect(() => {
    dispatch(getCustomersIdName());
  }, []);

  useEffect(() => {
    if (tripsByDate?.length > 0) {
      const raw = tripsByDate[currentTripIndex]?.customers || [];
      setCustomers(
        raw.map(({ customMessage, ...rest }) => ({
          ...rest,
          qtyOverride: rest.qtyOverride ?? null,
          deliveryNote: rest.deliveryNote ?? customMessage ?? "",
        }))
      );
    } else {
      setCustomers([]);
    }
  }, [tripsByDate, currentTripIndex]);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setCustomers((prev) => {
      const oldIndex = prev.findIndex((c) => c.customerId === active.id);
      const newIndex = prev.findIndex((c) => c.customerId === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedCustomer(null);
    setHighlightedIndex(-1);
    if (!isDropdownOpen) setIsDropdownOpen(true);
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setSearchQuery("");
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  const handleSearchKeyDown = (e) => {
    if (!isDropdownOpen || selectedCustomer) return;
    if (e.key === "ArrowDown") {
      setHighlightedIndex((i) => Math.min(i + 1, filteredCustomers.length - 1));
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      handleCustomerSelect(filteredCustomers[highlightedIndex]);
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  const handleAddCustomer = async () => {
    if (!selectedCustomer) return;
    if (customers.some((c) => c.customerId === selectedCustomer.customerId)) {
      setSelectedCustomer(null);
      setSearchQuery("");
      return;
    }
    try {
      const res = await fetch(`/api/v1/customerForTrips/${selectedCustomer.customerId}`);
      if (res.ok) {
        const { customer } = await res.json();
        setCustomers((prev) => [
          { ...customer, qtyOverride: null, deliveryNote: "" },
          ...prev,
        ]);
      }
    } catch (e) {
      setAlert({ type: "error", message: "Could not fetch customer details" });
    }
    setSelectedCustomer(null);
    setSearchQuery("");
  };

  const removeCustomer = (index) =>
    setCustomers((prev) => prev.filter((_, i) => i !== index));

  const updateCustomer = (index, field, value) =>
    setCustomers((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );

  const handleSave = async () => {
    if (!currentTrip) return;
    try {
      const res = await fetch(
        `/api/v1/trips/overwrite-trip/${currentTrip.tripNumber}/${selectedDate}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tripDate: selectedDate,
            tripNumber: currentTrip.tripNumber,
            deliveryGuy: currentTrip.deliveryGuy,
            customers,
          }),
        }
      );
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setAlert({ type: "error", message: "Failed to save trip" });
      }
    } catch (error) {
      setAlert({ type: "error", message: String(error) });
    }
  };

  const searchRow = (
    <div className="edittrip-addrow">
      <div className="customer-search-wrap edittrip-search-wrap" ref={dropdownRef}>
        <input
          className="form-input customer-search-input"
          type="text"
          placeholder="Search by name or ID…"
          value={displayValue}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          onFocus={() => { if (!selectedCustomer) setIsDropdownOpen(true); }}
          autoComplete="off"
        />
        {selectedCustomer && (
          <button
            type="button"
            className="customer-clear-btn"
            onClick={() => { setSelectedCustomer(null); setSearchQuery(""); }}
          >
            ✕
          </button>
        )}
        {isDropdownOpen && !selectedCustomer && (
          <div className="customer-dropdown">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((c, idx) => (
                <div
                  key={c.customerId}
                  className={`customer-dropdown__item${idx === highlightedIndex ? " customer-dropdown__item--highlighted" : ""}`}
                  onMouseDown={() => handleCustomerSelect(c)}
                >
                  <span className="customer-dropdown__name">{c.name}</span>
                  <span className="customer-dropdown__id">{c.customerId}</span>
                </div>
              ))
            ) : (
              <div className="customer-dropdown__empty">No customers found</div>
            )}
          </div>
        )}
      </div>
      <button
        className="edittrip-add-btn"
        onClick={handleAddCustomer}
        disabled={!selectedCustomer}
        title="Add customer"
      >
        <IconPlus size={16} />
      </button>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <div className="et-mobile-header">
          <div className="et-mobile-row1">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="et-mobile-datepicker"
            />
            {tripsByDate?.length > 0 && (
              <span className="et-mobile-jarbadge"><img src={filledJar} alt="" style={{ width: 14, height: 14, objectFit: "contain" }} /> <span>{jarTotal} jars total</span></span>
            )}
          </div>
          {tripsByDate?.length > 0 && (
            <div className="et-mobile-row2">
              <button
                className="edittrip-nav"
                onClick={() => setCurrentTripIndex((i) => Math.max(i - 1, 0))}
                disabled={currentTripIndex === 0}
              >
                <IconChevronLeft size={17} />
              </button>
              <span className="et-mobile-tripname">
                {currentTrip?.tripNumber?.replace("trip", "Trip ")}
              </span>
              <button
                className="edittrip-nav"
                onClick={() => setCurrentTripIndex((i) => Math.min(i + 1, tripsByDate.length - 1))}
                disabled={currentTripIndex === tripsByDate.length - 1}
              >
                <IconChevronRight size={17} />
              </button>
              <span className="et-mobile-staffname">{currentTrip?.deliveryGuy}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="edittrip-topbar">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="edittrip-datepicker"
          />
          {tripsByDate?.length > 0 && (
            <>
              <button
                className="edittrip-nav"
                onClick={() => setCurrentTripIndex((i) => Math.max(i - 1, 0))}
                disabled={currentTripIndex === 0}
              >
                <IconChevronLeft size={15} />
              </button>
              <span className="edittrip-tripname">
                {currentTrip?.tripNumber?.replace("trip", "Trip ")}
              </span>
              <button
                className="edittrip-nav"
                onClick={() =>
                  setCurrentTripIndex((i) => Math.min(i + 1, tripsByDate.length - 1))
                }
                disabled={currentTripIndex === tripsByDate.length - 1}
              >
                <IconChevronRight size={15} />
              </button>
              <span className="edittrip-staffname">— {currentTrip?.deliveryGuy}</span>
              <span className="edittrip-jarbadge"><img src={filledJar} alt="" style={{ width: 14, height: 14, objectFit: "contain" }} /> {jarTotal} jars total</span>
            </>
          )}
        </div>
      )}

      {tripsByDateLoading ? (
        <Loader />
      ) : !tripsByDate?.length ? (
        <div className="edittrip-empty">
          <p>No trips found for this date</p>
          <button
            className="btn btn--primary"
            onClick={() => onSwitchTab("make")}
          >
            Go to Make Trip
          </button>
        </div>
      ) : (
        <>
          {searchRow}

          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext
              items={customers.map((c) => c.customerId)}
              strategy={verticalListSortingStrategy}
            >
              {isMobile ? (
                <div className="et-cardlist">
                  {customers.map((customer, index) => (
                    <SortableCard
                      key={customer.customerId}
                      customer={customer}
                      index={index}
                      onUpdate={updateCustomer}
                      onRemove={removeCustomer}
                    />
                  ))}
                </div>
              ) : (
                <div className="edittrip-table">
                  <div className="edittrip-thead">
                    <div className="et-drag" />
                    <div className="et-num">#</div>
                    <div className="et-id">ID</div>
                    <div className="et-name">NAME</div>
                    <div className="et-allot">ALLOTMENT</div>
                    <div className="et-qty">QTY OVERRIDE</div>
                    <div className="et-note">NOTE</div>
                    <div className="et-actions">ACTIONS</div>
                  </div>
                  {customers.map((customer, index) => (
                    <SortableRow
                      key={customer.customerId}
                      customer={customer}
                      index={index}
                      onUpdate={updateCustomer}
                      onRemove={removeCustomer}
                    />
                  ))}
                </div>
              )}
            </SortableContext>
          </DndContext>

          {isMobile ? (
            <div className="et-mobile-savebar">
              <button className="et-mobile-save-btn" onClick={handleSave}>
                Save trip
              </button>
              {saveSuccess && <span className="edittrip-saved">&#10003; Saved</span>}
            </div>
          ) : (
            <div className="et-desktop-savebar">
              <button className="btn btn--primary edittrip-save-cta" onClick={handleSave}>
                Save trip
              </button>
              {saveSuccess && <span className="edittrip-saved">&#10003; Saved</span>}
            </div>
          )}

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}
        </>
      )}
    </>
  );
};

export default EditTrip;
