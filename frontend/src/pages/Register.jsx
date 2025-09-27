import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (key) => (event) => {
    setFormData((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosInstance.post('/api/auth/register', formData);
      alert('Registration successful. Please log in.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#4d4d4d] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-[#5a5a5a] border border-[#707070] px-10 py-12 text-white shadow-[0_0_20px_rgba(0,0,0,0.35)] rounded-none"
        >
          <h1 className="text-xl font-semibold uppercase tracking-[0.4em] text-center mb-10">
            SIGN UP
          </h1>

          <div className="space-y-6">
            <input
              type="text"
              placeholder="Username"
              value={formData.name}
              onChange={handleChange('name')}
              className="w-full bg-transparent border border-[#8c8c8c] text-white placeholder-[#d9d9d9] rounded-none px-6 py-3 focus:outline-none focus:border-[#f5c400]"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange('email')}
              className="w-full bg-transparent border border-[#8c8c8c] text-white placeholder-[#d9d9d9] rounded-none px-6 py-3 focus:outline-none focus:border-[#f5c400]"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange('password')}
              className="w-full bg-transparent border border-[#8c8c8c] text-white placeholder-[#d9d9d9] rounded-none px-6 py-3 focus:outline-none focus:border-[#f5c400]"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-12 w-full bg-[#f5c400] text-[#2d2d2d] font-bold uppercase tracking-[0.3em] py-3 rounded-none transition-colors duration-200 hover:bg-[#ffd200]"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
