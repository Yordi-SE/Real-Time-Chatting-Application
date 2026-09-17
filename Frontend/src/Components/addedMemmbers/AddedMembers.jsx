import React from "react";
import "./addedMembers.css";

function AddedMembers({ name, handleFunction }) {
  return (
    <div className="added">
      <h5>{name}</h5>
      <p className="x" onClick={handleFunction}>
        x
      </p>
    </div>
  );
}

export default AddedMembers;
