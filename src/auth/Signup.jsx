import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Base_URL} from '../Api/Base'

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
    age: '',
    gender: '',
    photoUrl: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(Base_URL+'/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      navigate('/login');
    } else {
      alert(await res.text());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold text-center">Signup</h2>
      {['firstName', 'lastName', 'emailId', 'password', 'age', 'gender', 'photoUrl'].map((field) => (
        <input
          key={field}
          name={field}
          type={field === 'password' ? 'password' : 'text'}
          placeholder={field}
          value={form[field]}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      ))}
      <button className="w-full bg-blue-500 text-white p-2 rounded">Sign Up</button>
    </form>
  );
};

export default Signup;
