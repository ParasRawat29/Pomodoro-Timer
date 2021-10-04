import "./App.css";
import Navbar from "./components/Navabar/Navbar";
import Timer from "./components/Timer/Timer";
import Analytics from "./components/Analytics/Analytics";
import { useState } from "react";
import { Switch } from "react-router";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
import { ProfileProvider } from "./components/context/profile.context";

function App() {
  var [sessionVal, setSessionVal] = useState("25");
  var [breakVal, setBreakVal] = useState("2");
  var [active, setActive] = useState("timer");

  function handleActiveTab(tabName) {
    setActive(() => tabName);
  }

  return (
    <>
      <ProfileProvider>
        <Navbar active={active} handleActiveTab={handleActiveTab} />

        <Switch>
          <PublicRoute path="/login">
            <LoginPage />
          </PublicRoute>
          <PublicRoute path="/signup">
            <SignUpPage />
          </PublicRoute>
          <PrivateRoute path="/" exact>
            <div class="mainContainer">
              <Timer
                sessionVal={sessionVal}
                breakVal={breakVal}
                setSessionVal={setSessionVal}
                setBreakVal={setBreakVal}
              />
            </div>
          </PrivateRoute>
          <PrivateRoute path="/analytics">
            <Analytics />
          </PrivateRoute>
        </Switch>
      </ProfileProvider>
    </>
  );
}

export default App;
