import React, { useEffect, useState } from "react";
import "./top.css";
import { FaBell } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { useChatContext } from "../../Context/chatContext";
import { useHistory } from "react-router-dom";
import { IoIosArrowUp } from "react-icons/io";
import SearchBar from "../searchBar/SearchBar";
import UserCard from "../userCard/UserCard";
import { set } from "mongoose";

function Top() {
  const {
    user,
    setIsPopUp,
    isPopUp,
    setChats,
    chats,
    isSelectedUserPopUp,
    notification,

    setNotification,
  } = useChatContext();
  const [isDropDisplay, setIsDropDisplay] = useState(false);
  const history = useHistory();
  const [isSearchBar, setIsSearchBar] = useState(false);
  const [searchResult, setsearchResult] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showError, setShowError] = useState(false);

  const handleCreateNewChat = (userId) => {
    fetch("http://localhost:5000/api/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user && user.token}`,
      },
      body: JSON.stringify({ userId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const chatResult = chats.find((chat) => chat._id === data[0]._id);
        if (!chatResult) {
          setChats([...chats, data[0]]);
        }
        setIsSearchBar(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (searchText.length > 0) {
      setSearchText("");
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  useEffect(() => {
    if (user && user.token && searchText.length > 0) {
      fetch(`http://localhost:5000/api/user?search=${searchText}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user && user.token}`,
          "Content-Type": "application/json", // Adjust the content type if needed
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setsearchResult(data);
          // console.log(data);
        })
        .catch((err) => console.error(err));
    }
  }, [searchText]);

  const handleLogout = () => {
    const userConfirmed = window.confirm("Are you sure you want to logout?");
    if (userConfirmed) {
      localStorage.clear();
      history.push("/login");
    } else {
      return;
    }
  };
  return (
    <div className={`top ${(isPopUp || isSelectedUserPopUp) && "hidden"}`}>
      <div
        className="search-bar-container"
        onClick={() => {
          setIsSearchBar(true);
        }}
      >
        <FaSearch className="search-bar" />

        <p>Search User</p>
      </div>
      <div id="searchBar" style={{ left: isSearchBar ? "0" : "-300px" }}>
        <div className="search-top">
          <p onClick={() => setIsSearchBar(false)} className="search-closer">
            close
          </p>

          <form onSubmit={(e) => submitHandler(e)}>
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {showError && <p>Please provide more than 0 characters</p>}
            <button type="submit" id="searchButton">
              Search
            </button>
          </form>
        </div>
        {searchResult.length > 0 ? (
          <div className="user-cards-container">
            {searchResult.map((user) => (
              <UserCard
                key={user._id}
                name={user.name}
                email={user.email}
                pic={user.pic}
                createNewChat={() => handleCreateNewChat(user._id)}
              />
            ))}
          </div>
        ) : (
          <p className="no-user">No User</p>
        )}
      </div>
      <div className="brand-logo">
        <h2 className="brand-logo-title">Vortex Verse</h2>
      </div>
      <div className="profile">
        <div className="topbarIconItem">
          <FaBell className="bell-icon" />
          {notification.length > 0 && (
            <span className="topbarIconBage">{notification.length}</span>
          )}
        </div>
        <div className="profile-main-cont">
          <img
            src={user && user.pic}
            alt="profile Pic"
            className="profile-img"
          />
          {isDropDisplay ? (
            <IoIosArrowUp
              className="drop-icon"
              onClick={() => setIsDropDisplay(!isDropDisplay)}
            />
          ) : (
            <FaChevronDown
              className="drop-icon"
              onClick={() => setIsDropDisplay(!isDropDisplay)}
            />
          )}
        </div>
        {isDropDisplay && (
          <div className="drop-down-menu">
            <p
              className="profile-menu"
              onClick={() => {
                setIsPopUp(true);
                setIsDropDisplay(false);
              }}
            >
              My Profile
            </p>
            <hr className="line-menu" />
            <p className="logout-menu" onClick={handleLogout}>
              Logout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Top;
