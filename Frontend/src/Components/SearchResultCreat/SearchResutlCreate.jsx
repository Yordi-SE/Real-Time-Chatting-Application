import React from "react";
import "./SearchResutlCreate.css";

function SearchResutlCreate({ name, email, pic, handleFunction }) {
  return (
    <div className="group-add-user" onClick={handleFunction}>
      <img src={pic} alt="profile" className="img-add-user" />
      <div>
        <p className="add-name">{name}</p>
        <p className="add-email">Email: {email}</p>
      </div>
    </div>
  );
}

export default SearchResutlCreate;
