import { Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ChatsPage from "./Pages/ChatsPage";
import Login from "./Components/login/Login";
import Signup from "./Components/signup/Signup";

function App() {
  return (
    <div className="App">
      <Route path="/login" component={Login} />
      <Route path="/register" component={Signup} />
      <Route path="/" component={HomePage} exact />
      <Route path="/chats" component={ChatsPage} />
    </div>
  );
}

export default App;
