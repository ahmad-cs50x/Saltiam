import React, { useState } from "react";
import Toast from "./Toast";
import { signIn } from "next-auth/react";
import Link from 'next/link';

import { api } from "../src/lib/apiClient";

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [step, setStep] = useState(1); // 1: Enter details, 2: Verify OTP
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSignIn = () => {
    signIn("google");
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/auth/send-otp", {
        email: formData.email
      });
      setToast({ message: "OTP sent to your email!", type: "success" });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp: formData.otp
      });

      localStorage.setItem("userToken", "demo-token");
      localStorage.setItem("userName", formData.name || formData.email.split("@")[0]);
      localStorage.setItem("userEmail", formData.email);
      setToast({ message: "Registration successful!", type: "success" });
      onClose();
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      otp: ""
    });
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-3 right-3 text-gray-500 hover:text-black" onClick={handleClose}>
          ✕
        </button>
        <h2 className="text-xl font-bold text-black text-center mb-4">
          {step === 1 ? "Create an Account" : "Verify Your Email"}
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          {step === 1 ? "Join Saltiam to start shopping" : `We sent a code to ${formData.email}`}
        </p>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {step === 1 ? (
          <form className="space-y-4 text-black" onSubmit={handleSendOTP}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 disabled:bg-gray-400 font-semibold"
            >
              {loading ? "Sending OTP..." : "Continue & Verify Email"}
            </button>
          </form>
        ) : (
          <form className="space-y-4 text-black" onSubmit={handleVerifyAndRegister}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter 6-digit OTP</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="000000"
                maxLength={6}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 disabled:bg-gray-400 font-semibold"
            >
              {loading ? "Verifying..." : "Verify & Register"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 font-medium"
            >
              Back
            </button>
          </form>
        )}
        
        <div className="my-4 text-center text-gray-500 text-sm">or</div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-100 text-gray-800 font-medium transition"
        >
          <img src="/google.png" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="text-sm text-center text-black mt-4">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="font-semibold text-pink-600 hover:text-pink-700 focus:outline-none"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;


// import React, { useState } from "react";
// import { XMarkIcon } from "@heroicons/react/24/outline";
// import { signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "../services/firebaseConfig";


// const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
//   const [step, setStep] = useState(1); // 1: Enter details, 2: Verify OTP
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     otp: ""
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;
      
//       const response = await axios.post("http://localhost:5000/api/auth/google", {
//         name: user.displayName,
//         email: user.email,
//         uid: user.uid
//       });

//       localStorage.setItem("userToken", response.data.token);
//       localStorage.setItem("userName", response.data.user.name);
//       localStorage.setItem("userEmail", response.data.user.email);

//       alert("Registration successful!");
//       onClose();
//       window.location.reload();
//     } catch (err) {
//       setError("Google sign-in failed. Please try again.");
//     }
//   };

//   const handleSendOTP = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return;
//     }

//     setLoading(true);

//     try {
//       await axios.post("http://localhost:5000/api/auth/send-otp", {
//         email: formData.email
//       });

//       alert("OTP sent to your email!");
//       setStep(2); // Move to OTP verification step
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyAndRegister = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const response = await axios.post("http://localhost:5000/api/auth/register", {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         otp: formData.otp
//       });

//       // Store user data and token
//       localStorage.setItem("userToken", response.data.token);
//       localStorage.setItem("userName", response.data.user.name);
//       localStorage.setItem("userEmail", response.data.user.email);

//       alert("Registration successful!");
//       onClose();
//       window.location.reload(); // Reload to update UI
//     } catch (err) {
//       setError(err.response?.data?.error || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setStep(1);
//     setFormData({
//       name: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       otp: ""
//     });
//     setError("");
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
//       onClick={handleClose}
//     >
//       <div
//         className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button className="absolute top-3 right-3" onClick={handleClose}>
//           <XMarkIcon className="w-6 h-6 text-gray-600 hover:text-black" />
//         </button>
        
//         <h2 className="text-xl font-bold text-black text-center mb-4">
//           {step === 1 ? "Create an Account" : "Verify Your Email"}
//         </h2>
//         <p className="text-sm text-center text-gray-600 mb-6">
//           {step === 1 ? "Join Saltiam to start shopping" : `We sent a code to ${formData.email}`}
//         </p>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         {step === 1 ? (
//           <form className="space-y-4 text-black" onSubmit={handleSendOTP}>
//             {/* Existing inputs */}
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Full Name"
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
//             />
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Email address"
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
//             />
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Password"
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
//             />
//             <input
//               type="password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               placeholder="Confirm Password"
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
//             />
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 disabled:bg-gray-400"
//             >
//               {loading ? "Sending OTP..." : "Send Verification Code"}
//             </button>
//           </form>
//         ) : (
//           <form className="space-y-4 text-black" onSubmit={handleVerifyAndRegister}>
//             {/* Existing OTP inputs */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Enter 6-digit OTP</label>
//               <input
//                 type="text"
//                 name="otp"
//                 value={formData.otp}
//                 onChange={handleChange}
//                 placeholder="000000"
//                 maxLength="6"
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-rose-500"
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 disabled:bg-gray-400"
//             >
//               {loading ? "Verifying..." : "Verify & Register"}
//             </button>
//             <button
//               type="button"
//               onClick={() => setStep(1)}
//               className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300"
//             >
//               Back
//             </button>
//           </form>
//         <div className="my-4 text-center">or</div>
//         <button
//           onClick={handleGoogleSignIn}
//           className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100"
//         >
//           <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
//           Continue with Google
//         </button>
//         )}

//         <p className="text-sm text-center text-black mt-4">
//           Already have an account?{" "}
//           <button
//             onClick={onSwitchToLogin}
//             className="font-semibold text-pink-600 hover:text-pink-700 focus:outline-none"
//           >
//             Sign In
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RegisterModal;
