import React from "react";
import "./rightText.css";

function RightText({ name, content, time }) {
  return (
    <div className="right-text-cont">
      <div className="text-cont-right">
        <p className="name-u">You</p>
        <p className="left-text">{content}</p>
      </div>
      <p className="time-ago-right">{time}</p>
    </div>
  );
}

export default RightText;
