import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../actions/userAction";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import Navigation from "../Navigation/Navigation";
import Title from "../layout/Title";
import "../Customers/CreateCustomer.scss";

const AdminCreateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showNavigation } = useSelector((state) => state.navigation);
  const { user } = useSelector((state) => state.user);
  const { adminCreateLoading, adminCreateSuccess, adminCreateError } =
    useSelector((state) => state.user);

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const initialState = { name: "", email: "", password: "", username: "", role: "user" };
  const [formData, setFormData] = useState(initialState);
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isAdminRole = formData.role === "admin";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg("");
    dispatch(createUser(formData));
  };

  useEffect(() => {
    if (adminCreateSuccess) {
      setSuccessMsg("User created successfully.");
      setFormData(initialState);
      dispatch({ type: "AdminCreateUserReset" });
    }
  }, [adminCreateSuccess]);

  return (
    <>
      <Title title="Create User" />
      <Navigation />
      <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
        <div className="create-customer">
          <form className="create-customer__form" onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="form-section__header">Create New User</div>
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label" htmlFor="name">
                    Full name
                  </label>
                  <input
                    className="form-input"
                    required
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="role">
                    Role
                  </label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>

                {isAdminRole ? (
                  <>
                    <div className="form-field">
                      <label className="form-label" htmlFor="email">
                        Email
                      </label>
                      <input
                        className="form-input"
                        required
                        type="email"
                        id="email"
                        name="email"
                        placeholder="user@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="password">
                        Password
                      </label>
                      <div className="form-password-wrap">
                        <input
                          className="form-input"
                          required
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          placeholder="Min 8 characters"
                          value={formData.password}
                          onChange={handleChange}
                          minLength={8}
                        />
                        <button type="button" className="form-eye" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                          {showPassword ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-field">
                      <label className="form-label" htmlFor="username">
                        Username
                      </label>
                      <input
                        className="form-input"
                        required
                        type="text"
                        id="username"
                        name="username"
                        placeholder="e.g. rahul_delivery"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="password">
                        Password
                      </label>
                      <div className="form-password-wrap">
                        <input
                          className="form-input"
                          required
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          placeholder="Min 8 characters"
                          value={formData.password}
                          onChange={handleChange}
                          minLength={8}
                        />
                        <button type="button" className="form-eye" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                          {showPassword ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {successMsg && (
              <p style={{ color: "var(--color-success)", fontFamily: "Poppins", fontSize: "13px", margin: "0 0 12px" }}>
                {successMsg}
              </p>
            )}
            {adminCreateError && (
              <p style={{ color: "var(--color-danger)", fontFamily: "Poppins", fontSize: "13px", margin: "0 0 12px" }}>
                {adminCreateError}
              </p>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn--primary" disabled={adminCreateLoading}>
                {adminCreateLoading ? "Creating…" : "Create user"}
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminCreateUser;
