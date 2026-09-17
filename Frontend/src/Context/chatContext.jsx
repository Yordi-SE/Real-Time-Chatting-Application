import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isPopUp, setIsPopUp] = useState(false);
  const [chats, setChats] = useState([]);
  const [clickedUser, setClickedUser] = useState("");
  const [isSelectedUserPopUp, setIsSelectedUserPopUp] = useState(false);
  const [newGroupDisplayed, setNewGroupDisplayed] = useState(false);
  const [notification, setNotification] = useState([]);

  const history = useHistory();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUser(userData);
    if (!userData) {
      history.push("/login");
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [user]);

  const fetchChats = () => {
    if (user && user.token) {
      fetch("http://localhost:5000/api/chat/mychat", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user && user.token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setChats(data);
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    }
  };

  // useEffect(() => {
  //   fetchChats();
  // }, []);
  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        isPopUp,
        setIsPopUp,
        chats,
        setChats,
        clickedUser,
        setClickedUser,
        isSelectedUserPopUp,
        setIsSelectedUserPopUp,
        newGroupDisplayed,
        setNewGroupDisplayed,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export { ChatProvider, useChatContext };
