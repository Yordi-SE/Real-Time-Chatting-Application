import React from "react";
import "./Lefttext.css";

function LeftText({ content, name, pic, time }) {
  return (
    <div className="left-text-cont">
      <div className="img-msg">
        <img src={pic} alt="" className="sender-img" />
        <div className="text-cont">
          <p className="name-sender">{name}</p>
          <p className="left-text">{content}</p>
        </div>
      </div>
      <p className="time-ago">{time}</p>
    </div>
  );
}

export default LeftText;
