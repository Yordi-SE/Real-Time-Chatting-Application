import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

function HomePage() {
  const history = useHistory();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      history.push("/chats");
    }
  }, []);
  return <div>HomePage</div>;
}

export default HomePage;
