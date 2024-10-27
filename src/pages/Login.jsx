import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [passwordVisible, setPasswordVisible] = useState(false); // Password visibility state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Set loading to true

    try {
      const response = await axios.post('http://localhost:8080/api/login', credentials);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Login failed. Please check your email and password.');
      } else {
        setError('Login failed. Please try again later.');
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-800">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
        
        {error && <p className="text-red-500 text-center mb-4" aria-live="assertive">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Entrez votre email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6 relative"> {/* Added relative for positioning */}
            <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Entrez votre mot de passe"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-gray-500" // Adjust top position for better alignment
              onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
              aria-label={passwordVisible ? 'Hide password' : 'Show password'}
            >
              <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
            </button>
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Loading...' : 'Log In'} {/* Show loading state */}
          </button>

          {/* Uncomment if you want to add links for password recovery and sign-up */}
          {/* <div className="flex justify-between mt-4">
            <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
            <a href="#" className="text-blue-600 hover:underline">Sign Up</a>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
