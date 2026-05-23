import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { todayIST } from "../../utils/istDate";
import { getTripsByDate } from "../../actions/tripsAction";
import { getCustomersIdName } from "../../actions/customerAction";
import Alert from "../layout/Alert/Alert";
import {
  IconGripVertical,
  IconTrash,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
} from "@tabler/icons-react";

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

  const dragCustomer = useRef(null);
  const draggedOverCustomer = useRef(null);
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

  const handleSort = () => {
    const list = [...customers];
    const dragged = list[dragCustomer.current];
    list.splice(dragCustomer.current, 1);
    list.splice(draggedOverCustomer.current, 0, dragged);
    setCustomers(list);
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

  return (
    <>
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
            <span className="edittrip-jarbadge">&#x1FAD9; {jarTotal} jars total</span>
          </>
        )}
      </div>

      {tripsByDateLoading ? (
        <Loader />
      ) : !tripsByDate?.length ? (
        <div className="edittrip-empty">
          <p>No trips found for this date</p>
          <button
            className="common-cta common-cta-small"
            onClick={() => onSwitchTab("make")}
          >
            Go to Make Trip
          </button>
        </div>
      ) : (
        <>
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
              <div
                key={`${customer.customerId}-${index}`}
                className="edittrip-row"
                draggable
                onDragStart={() => (dragCustomer.current = index)}
                onDragEnd={handleSort}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => (draggedOverCustomer.current = index)}
              >
                <div className="et-drag">
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
                      updateCustomer(
                        index,
                        "qtyOverride",
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                  />
                </div>
                <div className="et-note">
                  <input
                    type="text"
                    placeholder="Note…"
                    value={customer.deliveryNote ?? ""}
                    onChange={(e) =>
                      updateCustomer(index, "deliveryNote", e.target.value)
                    }
                  />
                </div>
                <div className="et-actions">
                  <button
                    className="edittrip-delete"
                    onClick={() => removeCustomer(index)}
                  >
                    <IconTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="edittrip-footer">
            <button className="btn btn--primary" onClick={handleSave}>
              Save trip
            </button>
            {saveSuccess && <span className="edittrip-saved">&#10003; Saved</span>}
          </div>

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
