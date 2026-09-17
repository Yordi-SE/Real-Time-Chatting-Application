import React, { useEffect } from "react";
import { useChatContext } from "../../Context/chatContext";
import { IoMdAdd } from "react-icons/io";
import "./leftBar.css";
import MyChatCard from "../../MyChatCard/MyChatCard";
import senderNameExtractor from "../../methods/senderNameExtractor";

function LeftBar() {
  const { chats, user, setClickedUser, clickedUser, setNewGroupDisplayed } =
    useChatContext();

  const handleChatClicked = (chatId) => {
    setClickedUser(chatId);
  };

  return (
    <div className="left-bar">
      <div className="leftBar-header">
        <h2 className="leftBar-title">My Chats</h2>
        <div className="create-group">
          <h5
            className="new-group-title"
            onClick={() => setNewGroupDisplayed(true)}
          >
            New Group Chat
          </h5>
          <IoMdAdd className="leftBar-add" />
        </div>
      </div>
      <div className="left-main">
        {chats.length > 0 &&
          chats.map((chat) => {
            return (
              <MyChatCard
                key={chat._id}
                myId={chat._id}
                latest={chat.latestMessage}
                senderName={
                  chat.isGroupChat
                    ? chat.chatName
                    : senderNameExtractor(user._id, chat.users).name
                }
                handleFunction={() => handleChatClicked(chat._id)}
              />
            );
          })}
      </div>
    </div>
  );
}

export default LeftBar;
