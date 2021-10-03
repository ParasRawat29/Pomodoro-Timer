import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";
import { auth, database } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
} from "firebase/auth";

import { ref, serverTimestamp, set } from "firebase/database";

function SignUpPage() {
  const [details, setDetails] = useState({
    email: "",
    password: "",
    fname: "",
    lname: "",
  });

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
    createUserWithEmailAndPassword(auth, details.email, details.password)
      .then((credential) => {
        const userMeta = getAdditionalUserInfo(credential);
        if (userMeta.isNewUser) {
          set(ref(database, `/profiles/${credential.user.uid}`), {
            name: details.fname + " " + details.lname,
            createdAt: serverTimestamp(),
            profilePic: null,
            data: [{}],
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div class="signup-form">
        <form action="" method="">
          <h2>Sign Up</h2>
          <p>Please fill in this form to create an account!</p>
          <hr />
          <div class="form-group">
            <div class="row">
              <div class="col-xs-6">
                <input
                  type="text"
                  class="form-control"
                  name="fname"
                  placeholder="First Name"
                  required="required"
                  onChange={handleChange}
                  value={details.fname}
                />
              </div>
              <div class="col-xs-6">
                <input
                  type="text"
                  class="form-control"
                  name="lname"
                  placeholder="Last Name"
                  required="required"
                  value={details.lname}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
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
              onChange={handleChange}
              value={details.password}
            />
          </div>

          <div class="form-group">
            <button
              type="submit"
              class="btn btn-primary btn-lg"
              onClick={handleSubmit}
            >
              Sign Up
            </button>
          </div>
        </form>
        <div class="hint-text">
          Already have an account?
          <Link to="/login">Login here</Link>
        </div>
      </div>
    </>
  );
}

export default SignUpPage;
