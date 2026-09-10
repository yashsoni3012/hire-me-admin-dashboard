// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Input from "../../components/common/Input";
// import Button from "../../components/common/Button";
// import { showSuccess, showError } from "../../utils/toast";
// import { MdEmail } from "react-icons/md";

// const ForgotPassword = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess(false);

//     if (!email.trim()) {
//       showError("Please enter your email.");
//       setError("Please enter your email.");
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(email)) {
//       showError("Please enter a valid email.");
//       setError("Please enter a valid email.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const { data, status } = await axios.post(
//         "https://apidata.hiremejobs.in/user/forget-password",
//         {
//           email: email.trim(),
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       console.log("Response:", data);

//       if (status === 200 || data.success || data.status) {
//         setSuccess(true);

//         showSuccess(data.message || "Password reset link sent successfully.");

//         setTimeout(() => {
//           navigate("/login");
//         }, 3000);
//       } else {
//         showError(data.message || "Unable to send reset link.");
//         setError(data.message || "Unable to send reset link.");
//       }
//     } catch (err) {
//       console.log(err);

//       const message =
//         err.response?.data?.message ||
//         err.response?.data?.error ||
//         err.message ||
//         "Something went wrong.";

//       showError(message);
//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#2c0eee] to-slate-900 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2c0eee] rounded-2xl shadow-lg mb-4">
//             <span className="text-white text-2xl font-bold">C</span>
//           </div>
//           <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
//           <p className="text-gray-400 mt-1 text-sm">
//             Enter your email to receive a password reset link
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           {error && (
//             <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//               {error}
//             </div>
//           )}

//           {success ? (
//             <div className="space-y-4 text-center">
//               <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
//                 Password reset link sent! Please check your email.
//               </div>
//               <p className="text-sm text-gray-600">
//                 If you don't receive the email, check your spam folder or try
//                 again.
//               </p>
//               <Button
//                 onClick={() => navigate("/login")}
//                 className="w-full justify-center py-3"
//               >
//                 Back to Login
//               </Button>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div className="relative">
//                 <MdEmail
//                   className="absolute left-3 top-9 text-gray-400"
//                   size={18}
//                 />
//                 <Input
//                   label="Email address"
//                   type="email"
//                   required
//                   placeholder="Enter your registered email"
//                   className="pl-9"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full justify-center py-3"
//                 loading={loading}
//               >
//                 Send Reset Link
//               </Button>

//               <p className="text-center text-sm text-gray-600">
//                 Remember your password?{" "}
//                 <Link
//                   to="/login"
//                   className="text-[#2c0eee] hover:text-[#2c0eee] font-medium"
//                 >
//                   Sign in
//                 </Link>
//               </p>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;


import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { showSuccess, showError } from "../../utils/toast";
import { MdEmail } from "react-icons/md";
import HireMeLogo from '../../assets/HiremeLogoWhite.png'

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // AbortController reference to cancel request on unmount
  const abortControllerRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate email
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      showError("Please enter your email.");
      setError("Please enter your email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      showError("Please enter a valid email.");
      setError("Please enter a valid email.");
      return;
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);

      const response = await axios.post(
        "https://apidata.hiremejobs.in/user/forget-password", // your original endpoint
        { email: trimmedEmail },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 15000, // 15 seconds timeout
          signal: controller.signal,
        }
      );

      console.log("Response:", response);

      // Check for success (adjust according to your API response structure)
      if (response.status === 200 || response.data?.success || response.data?.status) {
        setSuccess(true);
        showSuccess(response.data?.message || "Password reset link sent successfully.");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        const msg = response.data?.message || "Unable to send reset link.";
        showError(msg);
        setError(msg);
      }
    } catch (err) {
      console.error("Forgot password error:", err);

      let message = "Something went wrong. Please try again.";

      // Handle axios errors
      if (axios.isCancel(err)) {
        message = "Request was cancelled.";
      } else if (err.code === "ECONNABORTED") {
        message = "Request timed out. The server may be slow or unreachable.";
      } else if (err.response) {
        // Server responded with error status
        message =
          err.response.data?.message ||
          err.response.data?.error ||
          `Server error (${err.response.status})`;
        if (err.response.status === 404) {
          message = "The password reset endpoint was not found. Please check the URL or contact support.";
        }
      } else if (err.request) {
        // No response from server
        message = "No response from server. Please check your internet connection.";
      } else {
        message = err.message || message;
      }

      showError(message);
      setError(message);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#2c0eee] to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        {/* <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2c0eee] rounded-2xl shadow-lg mb-4">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Enter your email to receive a password reset link
          </p>
        </div> */}
        <div className="text-center flex flex-col items-center justify-center mb-4">
                  <div className="inline-flex items-center justify-center w-24 h-16 rounded-2xl shadow-lg  overflow-hidden ">
                    <img
                      src={HireMeLogo}
                      alt="Hire Me Logo"
                      className="w-full h-full object-contain "
                      onError={() => setLogoError(true)}
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-white justify-center">Forgot Password</h2>
                </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="space-y-4 text-center">
              <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                Password reset link sent! Please check your email.
              </div>
              <p className="text-sm text-gray-600">
                If you don't receive the email, check your spam folder or try again.
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="w-full justify-center py-3"
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <MdEmail
                  className="absolute left-3 top-9 text-gray-400"
                  size={18}
                />
                <Input
                  label="Email address"
                  type="email"
                  required
                  placeholder="Enter your registered email"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full justify-center py-3"
                loading={loading}
              >
                Send Reset Link
              </Button>

              <p className="text-center text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-[#2c0eee] hover:text-[#2c0eee] font-medium"
                >
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;