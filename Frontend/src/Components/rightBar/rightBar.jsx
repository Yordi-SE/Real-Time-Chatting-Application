import React, { useEffect, useState } from "react";
import { useChatContext } from "../../Context/chatContext";
import "./rightBar.css";
import senderNameExtractor from "../../methods/senderNameExtractor";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import LeftText from "../LeftText/LeftText";
import RightText from "../leftBar/RightText/RightText";
import { format } from "timeago.js";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

function RightBar() {
  const {
    clickedUser,
    chats,
    user,
    isSelectedUserPopUp,
    setIsSelectedUserPopUp,
    notification,
    setNotification,
  } = useChatContext();
  const [msg, setMsg] = useState("");
  const [isHeading, setIsHeading] = useState(true);
  const [allMessages, setAllMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);

  let theChat;

  let newMessage;

  if (clickedUser && user && msg.length > 0) {
    newMessage = {
      chatId: clickedUser,
      senderId: user._id,
      content: msg,
    };
  }

  if (clickedUser) {
    theChat = chats.find((chat) => chat._id === clickedUser);
    // theChat = senderNameExtractor(
    //   user._id,
    //   chats.find((chat) => chat._id === clickedUser).users
    // );
  }

  // if (allMessages.length > 0) {
  //   console.log(allMessages);
  // }
  // let messages = [];
  // if (allMessages.length > 0) {
  //   console.log(allMessages);
  // }

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("stop typing", clickedUser);
    fetch("http://localhost:5000/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user && user.token}`,
      },
      body: JSON.stringify(newMessage && newMessage),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        socket.emit("new message", data);
        setAllMessages((allMessages) => {
          return [...allMessages, data];
        });
        setMsg("");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (chats.length > 0) {
        selectedChatCompare = chats.find((chat) => chat._id == clickedUser);
      }
      await fetchAllMessages();
    };

    fetchMessages();
    selectedChatCompare = chats.find((chat) => chat._id == clickedUser);
  }, [clickedUser]);

  const fetchAllMessages = async () => {
    try {
      if (clickedUser.length > 0) {
        const response = await fetch(
          `http://localhost:5000/api/message/${clickedUser}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user && user.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAllMessages(data);
        socket.emit("join chat", clickedUser);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        console.log("I was here");
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
        }
      } else {
        setAllMessages([...allMessages, newMessageRecieved]);
      }
    });
  });

  console.log(notification, "-------------------------");

  const typingHandler = (e) => {
    setMsg(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", clickedUser);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", clickedUser);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <div className="right-bar">
      {clickedUser.length > 0 ? (
        <div className="component-wrapper">
          <div className="rightBar-header">
            <h3 className="rightBar-name">
              {theChat.isGroupChat
                ? theChat.chatName
                : senderNameExtractor(
                    user._id,
                    chats.find((chat) => chat._id === clickedUser).users
                  ).name}
            </h3>
            {!isSelectedUserPopUp ? (
              <FaEye
                className="view"
                onClick={() => setIsSelectedUserPopUp(true)}
              />
            ) : (
              <FaEyeSlash className="view" />
            )}
          </div>

          <div className="rightBar-below">
            <div className="rightBar-main">
              {allMessages.length > 0 && (
                <>
                  {allMessages.map((msg) =>
                    user && user._id !== msg.sender._id ? (
                      <LeftText
                        key={msg._id}
                        content={msg.content}
                        name={msg.sender.name}
                        pic={msg.sender.pic}
                        time={format(msg.createdAt)}
                      />
                    ) : (
                      <RightText
                        key={msg._id}
                        content={msg.content}
                        name={user && user.name}
                        time={format(msg.createdAt)}
                      />
                    )
                  )}
                </>
              )}
            </div>
            {isTyping && (
              <p style={{ textAlign: "left" }}>{user && user.name}Typing</p>
            )}
            <form className="rightBar-footer" onSubmit={(e) => handleSubmit(e)}>
              <input
                type="text"
                value={msg}
                onChange={(e) => typingHandler(e)}
                className="msg-input"
                placeholder="Send a message"
              />
              <button type="submit" className="send-btn">
                send
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="start-chat-container">
          <h1 className="start-chat">Click on a User to Start Chatting</h1>
        </div>
      )}
    </div>
  );
}

export default RightBar;
