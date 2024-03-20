import React, { useState } from 'react'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";

// import firebase from "firebase/app";

import { auth, provider } from '../firebase.js';
import firebase from "firebase/app";

import axios from 'axios';
import './SignStyle.css'



const SingIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post("/auth/signin", { name, password });
      dispatch(loginSuccess(res.data));
      navigate("/")
    } catch (err) {
      dispatch(loginFailure());
    }
  };

  const signInWithGoogle = async () => {
    dispatch(loginStart());
  
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
  
      console.log("User Data:", user); // Log the user data
  
      axios
        .post("/auth/google", {
          name: user.displayName,
          email: user.email,
          img: user.photoURL,
        })
        .then((res) => {
          console.log("Backend Response:", res); // Log the backend response
          dispatch(loginSuccess(res.data));
          navigate("/");
        });
    } catch (error) {
      console.error("Error:", error); // Log any errors
      dispatch(loginFailure());
    }
  };
  

  return (
    <div className='sign-body'>
      <div className='signin-background'>
        <form className='form-sign-in'>
          <h3>Sign In Here</h3>

          <label className='username-label' htmlFor="username">Username</label>
          <input className='email-input'
            type="text" placeholder="Username" id="username"
            onChange={(e) => setName(e.target.value)} />

          <label className='username-label' htmlFor="password">Password</label>
          <input className='email-input'
            type="password" placeholder="Password" id="password"
            onChange={(e) => setPassword(e.target.value)} />

          <button className='button-login' onClick={handleLogin}>Sign In</button>
          <p>or</p>
          <button className='button-login' onClick={signInWithGoogle}>Signin with Google</button>

        </form>
      </div>
      <div className='signup-background'>
        <form className='form-sign-in'>
          <h3>Sign Up Here</h3>

          <label className='username-label' htmlFor="signupusername">Username</label>
          <input className='email-input'
            type="text" placeholder="Enter Username" id="signupusername"
            onChange={(e) => setName(e.target.value)} />

          <label className='username-label' htmlFor="signupemail">Email Id</label>
          <input className='email-input'
            type="email" placeholder="Enter Email ID" id="signupemail"
            onChange={(e) => setEmail(e.target.value)} />

          <label className='username-label' htmlFor="signuppassword">Password</label>
          <input className='email-input'
            type="password" placeholder="Enter Password" id="signuppassword"
            onChange={(e) => setPassword(e.target.value)} />

          <button className='button-login'>Sign Up</button>

        </form>
      </div>
    </div>
  )
}

export default SingIn

