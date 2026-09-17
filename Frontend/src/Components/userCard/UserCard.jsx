import React from "react";
import "./userCard.css";

function UserCard({ name, email, pic, createNewChat }) {
  return (
    <div className="user-card" onClick={createNewChat}>
      <img src={pic} alt="profile pic" className="profile-picture" />
      <div className="name-email">
        <p className="user-name">{name}</p>
        <p className="user-email">{email}</p>
      </div>
    </div>
  );
}

export default UserCard;
