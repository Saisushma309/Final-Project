import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Menu from '../menu/menu';
function HomePage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setErrors({ server: 'Username and password are required.' });
      return;
    }

    

    try {
        const response = await axios.post('http://localhost:3000/api/login', {
            username: username,
            password: password,
          });
      const { success, message, user, token } = response.data;

      if (success) {
        // Handle successful login, e.g., store user data and token in the state or localStorage
        console.log('Login successful:', message);
        console.log('User:', user);
        console.log('Token:', token);
        localStorage.setItem('token', token);
        navigate('/dashboard');
      } else {
        // Handle unsuccessful login
        setErrors({ server: message });
      }
    } catch (error) {
       // Handle network errors or other issues
       console.error('Error during login:', error.message);

       if (error.response) {
         // The request was made and the server responded with a status code
         const statusCode = error.response.status;
         const errorMessage = error.response.data.message;
 
         if (statusCode === 401) {
           setErrors({ server: 'Incorrect username or password' });
         } else if (statusCode === 404) {
           setErrors({ server: 'User not found' });
         } else {
           setErrors({ server: errorMessage || 'An error occurred during login.' });
         }
       } else {
         // The request was made but no response was received
         setErrors({ server: 'An error occurred during login.' });
       }
    }
  };

  return (
    <>
    <Menu/>
    <div className="py-5 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-md-3 mb-5">
          </div>
          <div className="col-md-6 mb-5 bg-white">
          {isLoggedIn ? (
                <div className="p-5">
                  <h2>Welcome back!</h2>
                  <p>You are already logged in. You can redirect to your dashboard...</p>
                </div>
              ) : (
            <form onSubmit={handleSubmit} className="p-5">
              <div className="row form-group">
                <div className="col-md-12 mb-3 mb-md-0">
                  <label className="font-weight-bold" htmlFor="username">Username</label>
                  <input type="text" id="username" className="form-control" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                  {errors.username && <p className="text-danger">{errors.username}</p>}
                  <label className="font-weight-bold" htmlFor="password">Password</label>
                  <input type="password" id="password" className="form-control" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                  {errors.password && <p className="text-danger">{errors.password}</p>}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-12">
                  <input type="submit" value="Submit" className="btn text-white px-4 py-2" style={{backgroundColor : 'green', color: 'white'}} variant={'secondary'} />
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-12">
                  {message && !errors.server && <p className={errors.server ? "text-danger" : "text-success"}>{message}</p>}
                  {errors.server && <p className="text-danger">{errors.server.split(':').length === 3 ? errors.server.split(':')[2] : errors.server}</p>}
                </div>
              </div>
            </form>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default HomePage;
