import React from "react";

const CustomButton = ({ children, remove, loading, disabled, ...others }) => {
  return (
    <button
      className={`${remove ? "btn-delete" : ""} btn-custom`}
      disabled={disabled || loading}
      {...others}
    >
      {children}
    </button>
  );
};

export default CustomButton;
