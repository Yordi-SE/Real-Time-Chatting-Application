import React, { useContext, useEffect, useState } from "react";
import { useChatContext } from "../Context/chatContext";
import Top from "../Components/top/top";
import LeftBar from "../Components/leftBar/leftBar";
import RightBar from "../Components/rightBar/rightBar";
import { CiSquareRemove } from "react-icons/ci";
import "./chats.css";
import senderNameExtractor from "../methods/senderNameExtractor";
import SearchResutlCreate from "../Components/SearchResultCreat/SearchResutlCreate";
import AddedMembers from "../Components/addedMemmbers/AddedMembers";

function ChatsPage() {
  const {
    isPopUp,
    setIsPopUp,
    chats,
    setChats,
    user,
    isSelectedUserPopUp,
    setIsSelectedUserPopUp,
    clickedUser,
    newGroupDisplayed,
    setNewGroupDisplayed,
  } = useChatContext();

  const [searchResult, setSearchResult] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [addedMembers, setAddedMembers] = useState([]);
  const [isError, setIsError] = useState(false);
  const [nameGroup, setNameGroup] = useState("");
  const [newChatName, setNewChatName] = useState("");
  let theChat;
  let gTheChat;

  if (clickedUser) {
    theChat = senderNameExtractor(
      user._id,
      chats.find((chat) => chat._id === clickedUser).users
    );
    gTheChat = chats.find((chat) => chat._id === clickedUser);
    console.log(gTheChat.groupAdmin, user._id);
  }

  const handleNameChange = (e, groupId, newChatName) => {
    e.preventDefault();

    setIsSelectedUserPopUp(false);
    fetch("http://localhost:5000/api/chat/rename", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user && user.token}`, // Add Bearer token to the headers
      },
      body: JSON.stringify({ name: newChatName, groupId: groupId }), // Convert data to JSON format
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        chats = chats.filter((chat) => chat._id !== clickedUser);
        setChats([...chats, data]);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error:", error);
      });
    setNewGroupDisplayed(false);
  };

  const handleAddGroupClick = (userId) => {
    const result = searchResult.find((res) => userId === res._id);
    if (!addedMembers.includes(result)) {
      setAddedMembers((addedMembers) => [...addedMembers, result]);
    }
  };

  const handleRemoveFunction = (userId) => {
    let result = [];
    addedMembers.forEach((added) => {
      if (added._id !== userId) {
        result.push(added);
      }
    });
    setAddedMembers(result);
  };

  useEffect(() => {
    console.log(addedMembers);
  }, [addedMembers]);

  const handleCreate = () => {
    if (addedMembers.length < 2 || nameGroup.length < 1) {
      setIsError(true);
    } else {
      isError && setIsError(false);
      setSearchText("");
      setNameGroup("");
      setAddedMembers([]);
      setSearchResult([]);
      let toBeSentUsersId = [];

      addedMembers.forEach((added) => {
        toBeSentUsersId.push(added._id);
        console.log(toBeSentUsersId);
        return;
      });
      fetch("http://localhost:5000/api/chat/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user && user.token}`, // Add Bearer token to the headers
        },
        body: JSON.stringify({ name: nameGroup, users: toBeSentUsersId }), // Convert data to JSON format
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("result", data);
          setChats((chats) => [...chats, data]);
        })
        .catch((error) => {
          // Handle errors
          console.error("Error:", error);
        });
      setNewGroupDisplayed(false);
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
          setSearchResult(data);
          // console.log(data);
        })
        .catch((err) => console.error(err));
    }
  }, [searchText]);
  return (
    <div className="chat-container">
      <Top />
      <div
        className={`bottom-container ${
          (isPopUp || isSelectedUserPopUp) && "hidden"
        }`}
      >
        <LeftBar />
        <RightBar />
      </div>
      {isPopUp && (
        <div className="profile-expand">
          <CiSquareRemove
            onClick={() => setIsPopUp(false)}
            className="remove-button"
          />
          <p className="profile-name">{user.name}</p>
          <img src={user.pic} alt="profile pic" className="profile-pic" />
          <p className="profile-email">
            <span className="email-title">Email: </span>
            {user.email}
          </p>
        </div>
      )}
      {newGroupDisplayed && (
        <div className="group-creation">
          <div className="left-up">
            <div className="top-group">
              <h1 className="group-creation-title">Create Group Chat</h1>
              <div className="form">
                <input
                  type="text"
                  className="group-input"
                  value={nameGroup}
                  onChange={(e) => setNameGroup(e.target.value)}
                  placeholder="add group name here"
                />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="group-input"
                  placeholder="search for user"
                />
                {isError && (
                  <p
                    style={{
                      color: "red",
                      marginBottom: "10px",
                      textAlign: "center",
                      fontSize: "10px",
                    }}
                  >
                    Please Provide more than one member or give name of the
                    group
                  </p>
                )}
                <button className="create-btn" onClick={handleCreate}>
                  create
                </button>
                <div className="added-members">
                  {addedMembers.length > 0 &&
                    addedMembers.map((added) => (
                      <AddedMembers
                        key={added._id}
                        name={added.name}
                        handleFunction={() => handleRemoveFunction(added._id)}
                      />
                    ))}
                </div>
              </div>
            </div>
            <p
              className="right-part"
              onClick={() => setNewGroupDisplayed(false)}
            >
              X
            </p>
          </div>
          <div className="left-down">
            <div className="search-result-for-group">
              {searchResult.length > 0 &&
                searchResult.map((res) => (
                  <SearchResutlCreate
                    key={res._id}
                    name={res.name}
                    email={res.email}
                    pic={res.pic}
                    handleFunction={() => handleAddGroupClick(res._id)}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
      {gTheChat && !gTheChat.isGroupChat ? (
        isSelectedUserPopUp && (
          <div className="profile-expand">
            <CiSquareRemove
              onClick={() => setIsSelectedUserPopUp(false)}
              className="remove-button"
            />
            <p className="profile-name">{theChat.name}</p>
            <img src={theChat.pic} alt="profile pic" className="profile-pic" />
            <p className="profile-email">
              <span className="email-title">Email: </span>
              {theChat.email}
            </p>
          </div>
        )
      ) : isSelectedUserPopUp &&
        user &&
        gTheChat &&
        gTheChat.groupAdmin._id === user._id ? (
        <div className="profile-expand group-name-change">
          <p
            className="popup-remover"
            onClick={() => setIsSelectedUserPopUp(false)}
          >
            x
          </p>
          <h2 className="group-name-change-title">Change Your Group Name</h2>
          <form
            onSubmit={(e) => handleNameChange(e, clickedUser, newChatName)}
            className="group-name-change-container"
          >
            <input
              type="text"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              className="group-name-change-text-field"
              placeholder="new group name"
            />
            <button type="submit" className="group-name-change-btn">
              update
            </button>
          </form>
        </div>
      ) : (
        isSelectedUserPopUp && (
          <div className="profile-expand group-name">
            <p
              className="popup-remover"
              onClick={() => setIsSelectedUserPopUp(false)}
            >
              x
            </p>
            <h1 className="chat-name-display">{gTheChat.chatName}</h1>
          </div>
        )
      )}
    </div>
  );
}

export default ChatsPage;
