import "./App.css";
import Navbar from "./components/Navabar/Navbar";
import Timer from "./components/Timer/Timer";
import Analytics from "./components/Analytics/Analytics";
import { Switch } from "react-router";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
import { ProfileProvider } from "./components/context/profile.context";
import { DataTimeProvider } from "./components/context/dataTime.context";

function App() {
  return (
    <>
      <ProfileProvider>
        <DataTimeProvider>
          <Navbar />

          <Switch>
            <PublicRoute path="/login">
              <LoginPage />
            </PublicRoute>
            <PublicRoute path="/signup">
              <SignUpPage />
            </PublicRoute>
            <PrivateRoute path="/" exact>
              <div class="mainContainer">
                <Timer />
              </div>
            </PrivateRoute>
            <PrivateRoute path="/analytics">
              <Analytics />
            </PrivateRoute>
          </Switch>
        </DataTimeProvider>
      </ProfileProvider>
    </>
  );
}

export default App;
