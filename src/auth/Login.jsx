import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { Base_URL } from '../Api/Base';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emailId, setEmailId] = useState('ashishar050488@gmail.com');
  const [password, setPassword] = useState('Ranjan@2025');

 // Login.js
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      `${Base_URL}/login`,
      { emailId, password },
      { withCredentials: true }
    );

    const data = res.data;
    console.log("🔥 Login response data:", data);

   if (data.token && data.user) {
  dispatch(loginSuccess({ user: data.user, token: data.token }));
  localStorage.setItem('auth', JSON.stringify({ user: data.user, token: data.token }));
  navigate('/');
} else {
      alert('Login failed: Token not received.');
    }
  } catch (err) {
    alert('Login failed: ' + (err.response?.data?.message || err.message));
  }
};

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold text-center">Login</h2>
      <input
        type="email"
        name="emailId"
        placeholder="Email"
        value={emailId}
        onChange={(e) => setEmailId(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button className="w-full bg-green-500 text-white p-2 rounded">Login</button>
    </form>
  );
};

export default Login;
