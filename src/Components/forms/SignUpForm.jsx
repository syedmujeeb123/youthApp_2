import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useFirebase } from '../../context/SimpleFirebase';
import InputField from "../UI/reusable/InputField";
import ReusableButton from "../UI/reusable/ReusableButton";
import Show_username from "../UI/reusable/Show_username";
import BackButton from "../UI/reusable/BackTo";
import { Link } from "react-router-dom";
import { handleMultipleDeviceLogin } from "../../utils/sessionManager";






//  _________________________________________________________________________________________________




const SignUpForm = () => {

  //  _________________________________________________________________________________________________
  // my changes

  const fire = useFirebase();
  const navigate = useNavigate();


  useEffect(() => {
    if (fire.isloggedin) {
      navigate("/");
    }
  }, [fire.isloggedin, navigate]);



  // function
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = signUpForm;

    try {
      console.log("Signing up the user...");
      console.log(signUpForm, "signUpForm");
      const result = await fire.registeringwithuserandpass(name, email, password);
      console.log("Signup successful:", result);
      
      // Handle multiple device login
      if (result.user) {
        handleMultipleDeviceLogin(result.user);
      }
      
      // Show success message
      alert("✅ Signup successful! Please wait for admin approval.");
      navigate("/login"); // redirect to login page
    } catch (error) {
      console.error("Signup failed:", error);
      
      // Show user-friendly error messages
      let errorMessage = "Signup failed. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      }
      
      alert(`❌ ${errorMessage}`);
    }
  };



  //  _________________________________________________________________________________________________




  // const { signup, loading } = useAuth();
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await signup(signUpForm);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className=" flex justify-between items-center  ">


      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Create Account
        </h2>

        <InputField
          type="text"
          placeholder="Name"
          value={signUpForm.name}
          onChange={(e) =>
            setSignUpForm({ ...signUpForm, name: e.target.value })
          }
          className="w-full p-2 border rounded-md mb-4"
          required
        />

        <InputField
          type="email"
          placeholder="Email"
          value={signUpForm.email}
          onChange={(e) =>
            setSignUpForm({ ...signUpForm, email: e.target.value })
          }
          className="w-full p-2 border rounded-md mb-4"
          required
        />

        <InputField
          type="password"
          placeholder="Password"
          value={signUpForm.password}
          onChange={(e) =>
            setSignUpForm({ ...signUpForm, password: e.target.value })
          }
          className="w-full p-2 border rounded-md mb-4"
          required
        />

        <ReusableButton text="Sign Up" type="submit" />



        {/*  */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Log in here
            </Link>
          </p>
        </div>





      </form>
    </div>
  );
};

export default SignUpForm;


