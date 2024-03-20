import React, { useState } from 'react';
import './SignUpStyle.css';
import { Player } from '@lottiefiles/react-lottie-player';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import axios from 'axios';

import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";


const Signup = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSignup = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      dispatch(loginSuccess(res.data))
      navigate("/singin")
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        console.log(error);
      }
    }
  }

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
    signInWithPopup(auth, provider)
      .then((result) => {
        axios
          .post("/auth/google", {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            console.log(res)
            dispatch(loginSuccess(res.data));
            navigate("/")
          });
      })
      .catch((error) => {
        dispatch(loginFailure());
      });
  };



  const [isSignUpActive, setIsSignUpActive] = useState(false);

  const handleSignUpClick = () => {
    setIsSignUpActive(true);
  };

  const handleSignInClick = () => {
    setIsSignUpActive(false);
  };

  return (
    <div class='signuppageconatiner'>
      <div className={`container ${isSignUpActive ? 'right-panel-active' : ''}`}>
        {/* create account */}
        <div class="online-video-form sign-up-container">

          <form>
            <h1 className='online-video-signup-heading'>Create Account</h1>
            <input type="text"
              className='signup-input'
              onChange={(e) => setName(e.target.value)}
              placeholder="Name" required />
            <input type="email"
              className='signup-input'
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email" required />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className='signup-input'
              placeholder="Password"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,24}$"
              title="Password must be 8-24 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (!@#$%^&*_=+-)"
              required
            />

            <button className='online-signup-button'
              onClick={handleSignup}
            >Sign Up</button>
            {errorMessage && (
              <p className="error-message">{errorMessage}</p>
            )}
          </form>
        </div>

        <div class="online-video-form sign-in-container">
          <form action="#">
            <h1 className='online-video-signup-heading'>Sign in</h1>
            <input type="email" id='username' className='signup-input'
              onChange={(e) => setName(e.target.value)}
              placeholder="Email" />
            <input type="password"
              onChange={(e) => setPassword(e.target.value)}
              className='signup-input' placeholder="Password" />
            {/* <a href="# ">Forgot your password?</a> */}
            <button className='online-signup-button'
              onClick={handleLogin}
            >Sign In</button>
            or
            <button className='online-signup-button' onClick={signInWithGoogle}>Signin with Google</button>
          </form>
        </div>
        <div class="online-video-overlay-container">
          <div class="online-video-overlay">
            <div class="online-video-overlay-panel online-video-overlay-left">
              <Player
                autoplay
                loop
                controls
                hover
                src="https://lottie.host/fada2f38-8563-4558-b7b9-16af62445426/Cdz35LMXPp.json"
                style={{ height: '250px', width: '250px' }}
                background="transparent"
                speed="1"
              >
              </Player>
              <h1 className='online-video-signup-heading'>Welcome Back Online Video Platform!</h1>
              <p className='online-video-signup-sub'>To stay connected with us, please log in using your personal information.</p>
              <button className='online-signup-button btnn' onClick={handleSignInClick}>Sign In</button>
            </div>
            <div class="online-video-overlay-panel online-video-overlay-right">
              <Player
                autoplay
                loop
                controls
                hover
                src="https://lottie.host/67a8207a-d163-4d99-aeba-ae0dc78ede99/mVpRzImxhH.json"
                style={{ height: '250px', width: '250px' }}
                background="transparent"
                speed="1"
              >
              </Player>
              <h1 className='online-video-signup-heading'>Hello, Friend!</h1>
              <p className='online-video-signup-sub'>Dive into the adventure by sharing your personal details and embark on this exciting journey with us.</p>
              <button className='online-signup-button btnn' onClick={handleSignUpClick}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Signup
