import React, { useEffect, useState } from "react";
import "./myChatCard.css";
import { useChatContext } from "../Context/chatContext";

function MyChatCard({ senderName, handleFunction, myId, latest }) {
  const { clickedUser, notification } = useChatContext();

  console.log(latest);
  return (
    <div
      className="myChatCard"
      onClick={handleFunction}
      style={{
        backgroundColor: myId === clickedUser ? "#1877f2" : "#fff",
        color: myId === clickedUser ? "#fff" : "#000",
      }}
    >
      <p className="name-user">{senderName}</p>
      <p className="unread-message-container">
        <span className="unread-message">{senderName}: </span>
        {latest && latest.content}
      </p>
    </div>
  );
}

export default MyChatCard;
