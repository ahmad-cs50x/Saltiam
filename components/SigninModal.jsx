import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

const SigninModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Continue with Email using NextAuth Credentials provider or session storage fallback
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password
      });

      if (result?.error) {
        // Show the error returned by NextAuth
        setError(result.error);
      } else {
        // Successful login – store a demo token
        localStorage.setItem("userToken", "demo-token");
        localStorage.setItem("userName", formData.email.split("@")[0]);
        localStorage.setItem("userEmail", formData.email);
      }

      alert("Sign in successful!");
      onClose();
      window.location.reload();
    } catch (err) {
      setError("Sign in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-3 right-3 text-gray-500 hover:text-black" onClick={onClose}>
          ✕
        </button>

        <h2 className="text-xl font-bold text-black text-center mb-4">Welcome to Saltiam</h2>
        <p className="text-sm text-center text-gray-600 mb-6">Sign in to continue shopping</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form className="space-y-4 text-black" onSubmit={handleSubmit}>
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
          <div className="flex justify-end">
            <a href="/forgetpassword" onClick={onClose} className="text-sm font-semibold text-pink-600 hover:text-pink-700">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 disabled:bg-gray-400 font-semibold"
          >
            {loading ? "Signing In..." : "Continue with Email"}
          </button>
        </form>

        <div className="my-4 text-center text-gray-500 text-sm">or</div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-100 text-gray-800 font-medium transition"
        >
          <img src="/google.png" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
        <Link href="/adminlogin">
          <button
            type="button"
            className="w-full mt-3 flex items-center justify-center gap-2 border border-rose-500 py-2 rounded-md hover:bg-rose-100 text-rose-600 font-medium transition"
          >
            Admin Login
          </button>
        </Link>

        <p className="text-sm text-center text-black mt-4">
          Don't have an account?{" "}
          <button onClick={onSwitchToRegister} className="font-semibold text-pink-600 hover:text-pink-700 focus:outline-none">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default SigninModal;

// import React, { useState } from "react";
// import { XMarkIcon } from "@heroicons/react/24/outline";
// import { signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "../services/firebaseConfig";

// const SigninModal = ({ isOpen, onClose, onSwitchToRegister }) => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const response = await axios.post("http://localhost:5000/api/auth/login", {
//         email: formData.email,
//         password: formData.password
//       });

//       // Store user data and token
//       localStorage.setItem("userToken", response.data.token);
//       localStorage.setItem("userName", response.data.user.name);
//       localStorage.setItem("userEmail", response.data.user.email);

//       alert("Login successful!");
//       onClose();
//       window.location.reload(); // Reload to update UI
//     } catch (err) {
//       setError(err.response?.data?.error || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Google sign‑in handler
//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       console.log("Google user", result.user);
//       // Optionally send token to backend here
//       onClose();
//     } catch (error) {
//       console.error("Google sign‑in error", error);
//     }
//   };
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
//       <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
//         <button className="absolute top-3 right-3" onClick={onClose}>
//           <XMarkIcon className="w-6 h-6 text-gray-600" />
//         </button>

//         <h2 className="text-xl font-bold text-black text-center mb-4">Welcome to Saltiam</h2>
//         <p className="text-sm text-center text-gray-600 mb-6">Sign in to continue shopping</p>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         <form className="space-y-4 text-black" onSubmit={handleSubmit}>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           placeholder="Email address"
//           required
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
//         />
//         <input
//           type="password"
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//           placeholder="Password"
//           required
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 disabled:bg-gray-400"
//         >
//           {loading ? "Signing In..." : "Sign In"}
//         </button>
//       </form>
//       <div className="my-4 text-center">or</div>
//       <button
//         onClick={handleGoogleSignIn}
//         className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100"
//       >
//         <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
//         Continue with Google
//       </button>

//         <p className="text-sm text-center text-black mt-4">
//           Don't have an account?{" "}
//           <button onClick={onSwitchToRegister} className="font-semibold text-pink-600 hover:text-pink-700 focus:outline-none">
//             Signup
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SigninModal;
