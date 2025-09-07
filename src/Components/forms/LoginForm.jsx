import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import InputField from "../UI/reusable/InputField";
import ReusableButton from "../UI/reusable/ReusableButton";
import LoginProfileIcon from "../UI/reusable/LoginProfileIcon";
import BackButton from "../UI/reusable/BackTo";

//  _________________________________________________________________________________________________
// my changes
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { useFirebase } from '../../context/Me_Firebase';


//  _________________________________________________________________________________________________
//  _________________________________________________________________________________________________









function LoginForm() {

  //  _________________________________________________________________________________________________
  // my changes

  const fire = useFirebase();
  const navigate = useNavigate();



  useEffect(() => {
    if (fire.isloggedin) {
      navigate("/");
    }
  }, [fire.isloggedin, navigate]);



  //  _________________________________________________________________________________________________

  // const { login, loading } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginForm;

    try {
      console.log("logging up the user...");
      console.log(loginForm, "loginForm");
      const result = await fire.signinguserwithemailandpass(email, password);
      console.log("Login successful:", result);
      navigate("/"); // redirect after signup if needed
       } 
       
    catch (error) {
      setError(error.message || "Login failed");
      console.error("Login failed:", error);
    }

  };



  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   try {
  //     await login(loginForm);
  //   } catch (err) {
  //     setError(err);
  //   }

  // if (
  //   loginForm.email === "admin@example.com" &&
  //   loginForm.password === "1234"
  // ) {
  //   login({ email: loginForm.email });
  // } else {
  //   alert("Invalid Credentials");
  // }
  // };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="absolute top-5 left-5">
        <BackButton to="/" label="Go Back" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-2xl"
      >
        <div className="flex flex-col items-center mb-6">
          <LoginProfileIcon />
          <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
          <p className="text-sm text-gray-500">Please login to your account</p>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        </div>

        <div className="space-y-4">
          <InputField
            type="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <InputField
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <ReusableButton text="Login" type="submit" />
        </div>
      </form>

      {/* Signup Button Below Form */}
      <div className="mt-6">
        <p className="text-sm text-gray-600">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
