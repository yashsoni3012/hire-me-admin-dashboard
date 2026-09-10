// // import { useState } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { useDispatch, useSelector } from "react-redux";
// // import { loginUser } from "../../redux/slices/authSlice";
// // import { useAuth } from "../../context/AuthContext";
// // import Input from "../../components/common/Input";
// // import Button from "../../components/common/Button";
// // import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";

// // const Login = () => {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const { setUser } = useAuth();
// //   const { loading, error } = useSelector((s) => s.auth);
// //   const [form, setForm] = useState({
// //     email: "admin@gmail.com",
// //     password: "admin123",
// //   });
// //   const [showPass, setShowPass] = useState(false);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     const res = await dispatch(loginUser(form));
// //     if (loginUser.fulfilled.match(res)) {
// //       setUser(res.payload.user);
// //       navigate("/dashboard");
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#2c0eee] to-slate-900 flex items-center justify-center p-4">
// //       <div className="w-full max-w-md">
// //         {/* Logo */}
// //         <div className="text-center mb-8">
// //           <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2c0eee] rounded-2xl shadow-lg mb-4">
// //             <span className="text-white text-2xl font-bold">C</span>
// //           </div>
// //           <h1 className="text-2xl font-bold text-white">CareerAI Admin</h1>
// //           <p className="text-gray-400 mt-1 text-sm">
// //             Sign in to your admin account
// //           </p>
// //           <div className="mt-4 rounded-2xl bg-slate-800/80 border border-slate-700 px-4 py-3 text-sm text-slate-200">
// //             Use static credentials for now:
// //             <span className="font-semibold text-white">
// //               {" "}
// //               admin@gmail.com / admin123
// //             </span>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-2xl shadow-xl p-8">
// //           {error && (
// //             <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
// //               {error}
// //             </div>
// //           )}
// //           <form onSubmit={handleSubmit} className="space-y-5">
// //             <div className="relative">
// //               <MdEmail
// //                 className="absolute left-3 top-9 text-gray-400"
// //                 size={18}
// //               />
// //               <Input
// //                 label="Email address"
// //                 type="email"
// //                 required
// //                 placeholder="admin@gmail.com"
// //                 className="pl-9"
// //                 value={form.email}
// //                 onChange={(e) => setForm({ ...form, email: e.target.value })}
// //               />
// //             </div>
// //             <div className="relative">
// //               <MdLock
// //                 className="absolute left-3 top-9 text-gray-400"
// //                 size={18}
// //               />
// //               <Input
// //                 label="Password"
// //                 type={showPass ? "text" : "password"}
// //                 required
// //                 placeholder="Enter your password"
// //                 className="pl-9 pr-10"
// //                 value={form.password}
// //                 onChange={(e) => setForm({ ...form, password: e.target.value })}
// //               />
// //               <button
// //                 type="button"
// //                 onClick={() => setShowPass(!showPass)}
// //                 className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
// //               >
// //                 {showPass ? (
// //                   <MdVisibilityOff size={18} />
// //                 ) : (
// //                   <MdVisibility size={18} />
// //                 )}
// //               </button>
// //             </div>

// //             <div className="flex items-center justify-between">
// //               <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
// //                 <input type="checkbox" className="rounded" /> Remember me
// //               </label>
// //               <Link
// //                 to="/forgot-password"
// //                 className="text-sm text-[#2c0eee] hover:text-[#2c0eee] font-medium"
// //               >
// //                 Forgot password?
// //               </Link>
// //             </div>

// //             <Button
// //               type="submit"
// //               className="w-full justify-center py-3"
// //               loading={loading}
// //             >
// //               Sign in
// //             </Button>
// //           </form>
// //         </div>

// //         <p className="text-center text-gray-500 text-xs mt-6">
// //           © {new Date().getFullYear()} CareerAI · Maxgen Technologies Pvt. Ltd.
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;

// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import Input from '../../components/common/Input';
// import Button from '../../components/common/Button';
// import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login, loading, error: authError } = useAuth();
//   const [form, setForm] = useState({
//     email: 'admin@gmail.com',
//     password: 'admin123',
//   });
//   const [showPass, setShowPass] = useState(false);
//   const [localError, setLocalError] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLocalError(null);

//     // Basic validation
//     if (!form.email || !form.password) {
//       setLocalError('Please fill in all fields');
//       return;
//     }

//     const result = await login(form);
//     if (result.success) {
//       navigate('/dashboard');
//     } else {
//       setLocalError(result.error);
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
//           <h1 className="text-2xl font-bold text-white">CareerAI Admin</h1>
//           <p className="text-gray-400 mt-1 text-sm">
//             Sign in to your admin account
//           </p>
//           <div className="mt-4 rounded-2xl bg-slate-800/80 border border-slate-700 px-4 py-3 text-sm text-slate-200">
//             Use static credentials for now:
//             <span className="font-semibold text-white">
//               {' '}
//               admin@gmail.com / admin123
//             </span>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           {/* Display errors */}
//           {(authError || localError) && (
//             <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//               {authError || localError}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="relative">
//               <MdEmail
//                 className="absolute left-3 top-9 text-gray-400"
//                 size={18}
//               />
//               <Input
//                 label="Email address"
//                 type="email"
//                 required
//                 placeholder="admin@gmail.com"
//                 className="pl-9"
//                 value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//               />
//             </div>
//             <div className="relative">
//               <MdLock
//                 className="absolute left-3 top-9 text-gray-400"
//                 size={18}
//               />
//               <Input
//                 label="Password"
//                 type={showPass ? 'text' : 'password'}
//                 required
//                 placeholder="Enter your password"
//                 className="pl-9 pr-10"
//                 value={form.password}
//                 onChange={(e) => setForm({ ...form, password: e.target.value })}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPass(!showPass)}
//                 className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
//               >
//                 {showPass ? (
//                   <MdVisibilityOff size={18} />
//                 ) : (
//                   <MdVisibility size={18} />
//                 )}
//               </button>
//             </div>

//             <div className="flex items-center justify-between">
//               <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
//                 <input type="checkbox" className="rounded" /> Remember me
//               </label>
//               <Link
//                 to="/forgot-password"
//                 className="text-sm text-[#2c0eee] hover:text-[#2c0eee] font-medium"
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             <Button
//               type="submit"
//               className="w-full justify-center py-3"
//               loading={loading}
//             >
//               Sign in
//             </Button>
//           </form>
//         </div>

//         <p className="text-center text-gray-500 text-xs mt-6">
//           © {new Date().getFullYear()} CareerAI · Maxgen Technologies Pvt. Ltd.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import Input from '../../components/common/Input';
// import Button from '../../components/common/Button';
// import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login, loading, error: authError } = useAuth();
//   const [form, setForm] = useState({
//     email: '',
//     password: '',
//   });
//   const [showPass, setShowPass] = useState(false);
//   const [localError, setLocalError] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLocalError(null);

//     // Basic validation
//     if (!form.email || !form.password) {
//       setLocalError('Please fill in all fields');
//       return;
//     }

//     const result = await login(form);
//     if (result.success) {
//       navigate('/dashboard');
//     } else {
//       setLocalError(result.error);
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
//           <h1 className="text-2xl font-bold text-white">CareerAI Admin</h1>
//           <p className="text-gray-400 mt-1 text-sm">
//             Sign in to your admin account
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           {/* Display errors */}
//           {(authError || localError) && (
//             <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//               {authError || localError}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="relative">
//               <MdEmail
//                 className="absolute left-3 top-9 text-gray-400"
//                 size={18}
//               />
//               <Input
//                 label="Email address"
//                 type="email"
//                 required
//                 placeholder="Enter your email"
//                 className="pl-9"
//                 value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//               />
//             </div>
//             <div className="relative">
//               <MdLock
//                 className="absolute left-3 top-9 text-gray-400"
//                 size={18}
//               />
//               <Input
//                 label="Password"
//                 type={showPass ? 'text' : 'password'}
//                 required
//                 placeholder="Enter your password"
//                 className="pl-9 pr-10"
//                 value={form.password}
//                 onChange={(e) => setForm({ ...form, password: e.target.value })}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPass(!showPass)}
//                 className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
//               >
//                 {showPass ? (
//                   <MdVisibilityOff size={18} />
//                 ) : (
//                   <MdVisibility size={18} />
//                 )}
//               </button>
//             </div>

//             <div className="flex items-center justify-between">
//               <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
//                 <input type="checkbox" className="rounded" /> Remember me
//               </label>
//               <Link
//                 to="/forgot-password"
//                 className="text-sm text-[#2c0eee] hover:text-[#2c0eee] font-medium"
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             <Button
//               type="submit"
//               className="w-full justify-center py-3"
//               loading={loading}
//             >
//               Sign in
//             </Button>
//           </form>
//         </div>


//       </div>
//     </div>
//   );
// };

// export default Login;



import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import HireMeLogo from '../../assets/HiremeLogoWhite.png'
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { FcGoogle } from "react-icons/fc";
const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!form.email || !form.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    const result = await login(form);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setLocalError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#2c0eee] to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center flex flex-col items-center justify-center mb-4">
          <div className="inline-flex items-center justify-center w-24 h-16 rounded-2xl shadow-lg  overflow-hidden ">
            <img
              src={HireMeLogo}
              alt="Hire Me Logo"
              className="w-full h-full object-contain "
              onError={() => setLogoError(true)}
            />
          </div>
          <h2 className="text-2xl font-bold text-white justify-center">Welcome back!</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Display errors */}
          {(authError || localError) && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {authError || localError}
            </div>
          )}

          {/* Google Login Button */}
          {/* <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-4"
          >
            <FcGoogle size={20} className="text-red-500" />
            <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
          </button> */}

          {/* OR Divider */}
          {/* <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div> */}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <MdEmail
                className="absolute left-3 top-9 text-gray-400"
                size={18}
              />
              <Input
                label="Email ID / Phone Number *"
                type="email"
                required
                placeholder="Enter email or phone number"
                className="pl-9"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <MdLock
                className="absolute left-3 top-9 text-gray-400"
                size={18}
              />
              <Input
                label="Password *"
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                className="pl-9 pr-10"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPass ? (
                  <MdVisibilityOff size={18} />
                ) : (
                  <MdVisibility size={18} />
                )}
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full justify-center py-3 bg-[#2c0eee] hover:bg-[#2c0eee]"
              loading={loading}
            >
              Login
            </Button>

            {/* OTP Login Link */}
            <div className="text-center">
              <Link
                to="/login-otp"
                className="text-sm text-[#2c0eee] hover:text-[#2c0eee] font-medium"
              >
                Login via OTP
              </Link>
            </div>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-600 mt-2">
              Forgot Password?{" "}
              <Link
                to="/forgot-password"
                className="text-[#2c0eee] hover:text-[#2c0eee] font-medium"
              >
                Click here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;