import { useState, useEffect } from "react";
import Loader from "../layout/Loader/Loader";
import { Link, Navigate, useLocation } from "react-router-dom";
import { logout } from "../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../../assets/manikaran_waters_logo.png";
import "./navigation.scss";
// import { useAlert } from "react-alert";
import { toggleNavigation } from "../../actions/navigationAction";
import {
  IconUsers,
  IconRepeat,
  IconPencil,
  IconReportAnalytics,
  IconReceipt,
  IconTrendingUp,
  IconHexagon,
  IconTruckDelivery,
  IconChartBar,
  IconMapPin,
  IconUserPlus,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconChevronUp,
  IconChevronDown,
} from "@tabler/icons-react";

const Navigation = () => {
  const dispatch = useDispatch();
  // const alert = useAlert();
  let { showNavigation } = useSelector((state) => state.navigation);


  const location = useLocation();

  const getInitialMenu = (pathname) => {
    if (pathname === "/customers" || pathname.startsWith("/customer/") || pathname === "/quickaccess" || pathname === "/customers/edit") return "customer";
    if (pathname === "/customers/frequency") return "habits";
    if (pathname === "/delivery/new" || pathname === "/payment/new") return "entries";
    if (pathname.startsWith("/deliveries") || pathname.startsWith("/payments")) return "reports";
    if (pathname === "/expense/new" || pathname === "/expenses") return "expense";
    if (pathname === "/customerspredictions") return "prediction";
    if (pathname.startsWith("/jarInventory")) return "jarcount";
    if (pathname === "/deliverytrips") return "deliverytrips";
    if (pathname.startsWith("/report")) return "sales";
    if (pathname === "/deliveryPanel") return null;
    return null;
  };

  const [openMenu, setOpenMenu] = useState(() => getInitialMenu(location.pathname));

  const toggleMenu = (key) =>
    setOpenMenu((prev) => (prev === key ? null : key));

  const handleMenuClick = (key) => {
    if (!showNavigation) {
      dispatch(toggleNavigation(true));
      setOpenMenu(key);
    } else {
      toggleMenu(key);
    }
  };

  const isActive = (to) => {
    const [path, qs] = to.split("?");
    if (!qs)
      return (
        location.pathname === path ||
        location.pathname.startsWith(path + "/")
      );
    return location.pathname === path && location.search === "?" + qs;
  };

  const toggleNavigationInside = () => {
    showNavigation = !showNavigation;
    dispatch(toggleNavigation(showNavigation));
  };

  const closeNavOnMobile = () => {
    if (window.innerWidth <= 600 && showNavigation) {
      dispatch(toggleNavigation(false));
    }
  };

  const { user, loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (error) {
      console.log(error);
    }
    if (isAuthenticated === false) {
      Navigate("/");
    }
  }, [isAuthenticated, alert, error]);

  function logoutUser() {
    dispatch(logout());
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="navigated-container">
          <nav className={`${showNavigation ? "show" : "hide"}`}>
            <Link to="/dashboard" className="nav-brand" onClick={closeNavOnMobile}>
              <img src={Logo} alt="Manikaran Waters" className="nav-logo" />
              <span className="nav-brand-title">MANIKARAN WATERS</span>
              <button
                className="menu-toggle-button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleNavigationInside(); }}
                title="Collapse sidebar"
              >
                <IconLayoutSidebarLeftCollapse size={22} />
              </button>
            </Link>

            <button
              className="nav-expand-trigger"
              onClick={toggleNavigationInside}
              title="Expand sidebar"
            >
              <IconLayoutSidebarLeftExpand size={20} />
            </button>

            {(user.role === "admin" || user.role === "user") && (
              <>
                <div className="nav-section-label">Customers</div>
                <div className="menu">
                  <button className="menu-button" onClick={() => handleMenuClick("customer")}>
                    <IconUsers size={18} />
                    <span>Customer</span>
                    <span className="menu-chevron">
                      {openMenu === "customer" ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                    </span>
                  </button>
                  <div className={`submenu${openMenu === "customer" ? " open" : ""}`}>
                    <Link to="/customer/new" className={isActive("/customer/new") ? "active" : ""} onClick={closeNavOnMobile}>New Customer</Link>
                    <Link to="/customers" className={location.pathname === "/customers" ? "active" : ""} onClick={closeNavOnMobile}>Customer Details</Link>
                    <Link to="/quickaccess" className={isActive("/quickaccess") ? "active" : ""} onClick={closeNavOnMobile}>Quick Access</Link>
                    <Link to="/customers/edit" className={isActive("/customers/edit") ? "active" : ""} onClick={closeNavOnMobile}>Edit Customer</Link>
                  </div>
                </div>

                <div className="menu">
                  <Link to="/customers/frequency" className={`menu-button${isActive("/customers/frequency") ? " active" : ""}`} onClick={closeNavOnMobile}>
                    <IconRepeat size={18} />
                    <span>Customer Habits</span>
                  </Link>
                </div>

                <div className="nav-section-label">Operations</div>
                <div className="menu">
                  <button className="menu-button" onClick={() => handleMenuClick("entries")}>
                    <IconPencil size={18} />
                    <span>Entries</span>
                    <span className="menu-chevron">
                      {openMenu === "entries" ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                    </span>
                  </button>
                  <div className={`submenu${openMenu === "entries" ? " open" : ""}`}>
                    <Link to="/delivery/new" className={isActive("/delivery/new") ? "active" : ""} onClick={closeNavOnMobile}>New Delivery</Link>
                    <Link to="/payment/new" className={isActive("/payment/new") ? "active" : ""} onClick={closeNavOnMobile}>New Payment</Link>
                  </div>
                </div>

                <div className="menu">
                  <Link
                    to="/reports"
                    className={`menu-button${isActive("/reports") ? " active" : ""}`}
                    onClick={closeNavOnMobile}
                  >
                    <IconReportAnalytics size={18} />
                    <span>Reports</span>
                  </Link>
                </div>

                <div className="menu">
                  <button className="menu-button" onClick={() => handleMenuClick("expense")}>
                    <IconReceipt size={18} />
                    <span>Expense</span>
                    <span className="menu-chevron">
                      {openMenu === "expense" ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                    </span>
                  </button>
                  <div className={`submenu${openMenu === "expense" ? " open" : ""}`}>
                    <Link to="/expense/new" className={isActive("/expense/new") ? "active" : ""} onClick={closeNavOnMobile}>New Expense</Link>
                    <Link to="/expenses" className={isActive("/expenses") ? "active" : ""} onClick={closeNavOnMobile}>Expense Reports</Link>
                  </div>
                </div>

                <div className="menu">
                  <Link to="/customerspredictions" className={`menu-button${isActive("/customerspredictions") ? " active" : ""}`} onClick={closeNavOnMobile}>
                    <IconTrendingUp size={18} />
                    <span>Prediction</span>
                  </Link>
                </div>

                <div className="menu">
                  <button className="menu-button" onClick={() => handleMenuClick("jarcount")}>
                    <IconHexagon size={18} />
                    <span>Jar Count</span>
                    <span className="menu-chevron">
                      {openMenu === "jarcount" ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                    </span>
                  </button>
                  <div className={`submenu${openMenu === "jarcount" ? " open" : ""}`}>
                    <Link to="/jarInventory/today" className={isActive("/jarInventory/today") ? "active" : ""} onClick={closeNavOnMobile}>Today's Jar Count</Link>
                    <Link to="/jarInventory" className={isActive("/jarInventory") ? "active" : ""} onClick={closeNavOnMobile}>Jar Inventory</Link>
                  </div>
                </div>
              </>
            )}

            <div className="menu">
              <Link
                to="/deliverytrips"
                className={`menu-button${isActive("/deliverytrips") ? " active" : ""}`}
                onClick={closeNavOnMobile}
              >
                <IconTruckDelivery size={18} />
                <span>Delivery Trips</span>
              </Link>
            </div>

            {user.role === "admin" && (
              <div className="nav-section-label">Analytics</div>
            )}
            {user.role === "admin" && (
              <div className="menu">
                <Link
                  to="/report/sales"
                  className={`menu-button${isActive("/report/sales") ? " active" : ""}`}
                  onClick={closeNavOnMobile}
                >
                  <IconChartBar size={18} />
                  <span>Sales Report</span>
                </Link>
              </div>
            )}

            {user.role === "admin" && (
              <>
                <div className="nav-section-label">Admin</div>
                <div className="menu">
                  <Link
                    to="/admin/create-user"
                    className={`menu-button${isActive("/admin/create-user") ? " active" : ""}`}
                    onClick={closeNavOnMobile}
                  >
                    <IconUserPlus size={18} />
                    <span>Create User</span>
                  </Link>
                </div>
              </>
            )}

            {(user.role === "delivery" || user.role === "admin") && (
              <div className="menu">
                <Link
                  to="/deliveryPanel"
                  className={`menu-button${isActive("/deliveryPanel") ? " active" : ""}`}
                  onClick={closeNavOnMobile}
                >
                  <IconMapPin size={18} />
                  <span>Delivery Panel</span>
                </Link>
              </div>
            )}

            <div className="nav-user">
              <div
                className="nav-user-avatar"
                onClick={() => { if (!showNavigation) dispatch(toggleNavigation(true)); }}
              >
                {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div className="nav-user-info">
                <span className="nav-user-name">{user.name}</span>
                <span className="nav-user-meta">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  {" · "}
                  <span className="nav-user-logout" onClick={logoutUser}>Logout</span>
                </span>
              </div>
            </div>

          </nav>
        </div>
      )}

    </>
  );
};

export default Navigation;
