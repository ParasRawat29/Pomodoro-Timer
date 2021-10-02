import "./App.css";
import Navbar from "./components/Navabar/Navbar";
import Timer from "./components/Timer/Timer";
import SettingsSidebar from "./components/Sidebar/SettingsSidebar";
import Analytics from "./components/Analytics/Analytics";

import { useState } from "react";
import { Route, Switch } from "react-router";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
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
      <div class="mainContainer">
        <Navbar
          toggleSettingSideBar={toggleSettingSideBar}
          active={active}
          handleActiveTab={handleActiveTab}
        />
        <Switch>
          <Route path="/timer" exact>
            <Timer
              sessionVal={sessionVal}
              breakVal={breakVal}
              isTimerStarted={isTimerStarted}
              setisTimerStarted={setisTimerStarted}
            />
          </Route>
          <Route path="/analytics" exact>
            <Analytics />
          </Route>
          <Route path="/login" exact>
            <LoginPage />
          </Route>
          <Route path="/signup" exact>
            <SignUpPage />
          </Route>
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
      </div>
    </>
  );
}

export default App;
