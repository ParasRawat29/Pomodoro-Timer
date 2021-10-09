import React, { useState } from "react";
import { auth, database } from "../config/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ref, serverTimestamp, set } from "firebase/database";
import "./Signup.css";

function LoginPage() {
  const [details, setDetails] = useState({
    email: "",
    password: "",
  });

  const signInWithProvider = async (provider) => {
    try {
      const credential = await signInWithPopup(auth, provider);
      console.log("credential", credential);
      const userMeta = getAdditionalUserInfo(credential);
      console.log("Success");
      console.log(userMeta);
      if (userMeta.isNewUser) {
        await set(ref(database, `/profiles/${credential.user.uid}`), {
          name: credential.user.displayName,
          createdAt: serverTimestamp(),
          profilePic: credential.user.photoURL,
          data: [{}],
        });
      }
    } catch (err) {
      console.log("error", err.message);
    }
  };

  const onGoogleSignIn = () => {
    signInWithProvider(new GoogleAuthProvider());
  };

  const DemoSignIn = () => {
    signInWithEmailAndPassword(auth, "test123@gmail.com", "123456")
      .then((userCredential) => {
        // let user = userCredential.user;
        console.log("signed in");
        setDetails(() => {
          return {
            email: "",
            password: "",
          };
        });
      })
      .catch((error) => {
        let errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  const handleChange = (e) => {
    const ele = e.target.name;
    setDetails((pre) => {
      return {
        ...pre,
        [ele]: e.target.value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(details);
    signInWithEmailAndPassword(auth, details.email, details.password)
      .then((credential) => {
        const user = credential.user;

        console.log("logged in", user);
        setDetails(() => {
          return {
            email: "",
            password: "",
          };
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <div class="signup-form">
        <form action="" method="">
          <h3>Login</h3>
          <div class="row">
            <div class="form-group">
              <input
                type="email"
                class="form-control"
                name="email"
                placeholder="Email"
                value={details.email}
                required="required"
                onChange={handleChange}
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                class="form-control"
                name="password"
                placeholder="Password"
                required="required"
                value={details.password}
                onChange={handleChange}
              />
            </div>
            <div class="form-group">
              <button
                type="submit"
                class="btn btn-primary btn-lg"
                onClick={handleSubmit}
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="loginBtnWrapper">
        <button
          className="btn btn-warning "
          type="button"
          onClick={onGoogleSignIn}
        >
          Google Signin
        </button>
        <button className="btn btn-primary" type="button" onClick={DemoSignIn}>
          Demo Signin
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
