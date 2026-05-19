import React, { useState, useEffect } from "react";
import "./LoginSignUp.scss";
import Loader from "../layout/Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login } from "../../actions/userAction";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import Logo from "../../assets/manikaran_waters_logo.png";
import Title from "../layout/Title";

const LoginSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  useEffect(() => {
    if (error) {
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [dispatch, error, isAuthenticated, navigate]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Title title="Login" />
          <div className="login-page">
            <div className="login-card">
              <div className="login-brand">
                <img
                  src={Logo}
                  alt="Manikaran Waters"
                  className="login-brand__logo"
                />
                <span className="login-brand__name">Manikaran Waters</span>
                <span className="login-brand__tagline">Sign in to continue</span>
              </div>

              <form className="login-form" onSubmit={loginSubmit}>
                <div className="login-field">
                  <label className="login-label">Email address</label>
                  <input
                    className="login-input"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>

                <div className="login-field">
                  <label className="login-label">Password</label>
                  <div className="login-input-wrap">
                    <input
                      className="login-input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="login-eye"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <IconEyeOff size={16} />
                      ) : (
                        <IconEye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <Link to="/password/forgot" className="login-forgot">
                  Forgot password?
                </Link>

                <button type="submit" className="login-btn">
                  Login
                </button>
              </form>

              <p className="login-footer">Access is by invitation only</p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LoginSignUp;
