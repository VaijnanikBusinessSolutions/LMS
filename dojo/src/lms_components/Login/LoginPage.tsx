// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios, { AxiosError } from 'axios';
// import { loginSuccess } from '../../store/authSlice';
// import type{ AppDispatch } from '../../store/store';

// const API_URL = 'http://127.0.0.1:8000/api/';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);

//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();


 
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       // ✅ Send login request
//       const response = await axios.post(`${API_URL}token/`, { email, password });
//       console.log('Login successful:', response.data);

//       // ✅ Store in Redux
//       dispatch(loginSuccess(response.data));

//       // ✅ Role-based navigation
//       const userType = response.data.userType?.toLowerCase();

//       if (userType === 'admin' || userType === 'team leader') {
//         navigate('/AdminDashboard', { replace: true });
//       } else {
//         navigate('/dashboard', { replace: true });
//       }
//     } catch (err) {
//       console.error('Login failed:', err);
//       const axiosError = err as AxiosError<{ detail?: string }>;
//       const detail = axiosError.response?.data?.detail;

//       if (detail) {
//         setError(detail);
//       } else {
//         setError('Invalid credentials or server error.');
//       }
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-200">
//       <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-xl w-96">
//         <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
//         {error && <p className="text-red-500 text-center mb-4">{error}</p>}

//         <div className="mb-4">
//           <label>Email Address</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>

//         <div className="mb-6">
//           <label>Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//         >
//           Sign In
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;
