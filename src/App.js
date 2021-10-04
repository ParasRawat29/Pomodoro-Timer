import "./App.css";
import Navbar from "./components/Navabar/Navbar";
import Timer from "./components/Timer/Timer";
import SettingsSidebar from "./components/Sidebar/SettingsSidebar";
import Analytics from "./components/Analytics/Analytics";
import { useState } from "react";
import { Redirect, Route, Switch } from "react-router";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
import { ProfileProvider } from "./components/context/profile.context";

function App() {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(0);
  var [sessionVal, setSessionVal] = useState("25");
  var [breakVal, setBreakVal] = useState("2");
  var [active, setActive] = useState("timer");
  var [isTimerStarted, setisTimerStarted] = useState(false);

  function handleActiveTab(tabName) {
    setActive(() => tabName);
  }

  function toggleSettingSideBar() {
    // console.log("clicked");
    setSidebarIsOpen((pre) => !pre);
  }

  return (
    <>
      <ProfileProvider>
        <Navbar
          toggleSettingSideBar={toggleSettingSideBar}
          active={active}
          handleActiveTab={handleActiveTab}
        />

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
                isTimerStarted={isTimerStarted}
                setisTimerStarted={setisTimerStarted}
              />
            </div>
          </PrivateRoute>
          <PrivateRoute path="/analytics">
            <Analytics />
          </PrivateRoute>
        </Switch>

        {/* <SettingsSidebar
            toggleSettingSideBar={toggleSettingSideBar}
            sidebarIsOpen={sidebarIsOpen}
            setSessionVal={setSessionVal}
            setBreakVal={setBreakVal}
            sessionVal={sessionVal}
            breakVal={breakVal}
            isTimerStarted={isTimerStarted}
          /> */}
        {/* </div> */}
      </ProfileProvider>
    </>
  );
}

export default App;
