import React from "react";
import "./alert.css";

const Alert = ({ type, message, onClose }) => {
  return (
    <div className={`alert ${type}`}>
      <span>{message}</span>
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Alert;
