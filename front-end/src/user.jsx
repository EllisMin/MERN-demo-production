import React from "react";
import CustomButton from "./custom-button";

const User = ({ id, name, age, occupation, attr, handleDelete, loading }) => {
  return (
    <li className={`${attr ? "attr" : ""} user`}>
      <span>{name}</span>
      <span>{age}</span>
      <span>{occupation}</span>
      {!attr && (
        <CustomButton remove onClick={() => handleDelete(id)} loading={loading}>
          X
        </CustomButton>
      )}
    </li>
  );
};

export default User;
