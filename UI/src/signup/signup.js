import React, { useState } from 'react';
import axios from 'axios';
import Menu from '../menu/menu';
function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const errors = {};

    if (!firstName.trim()) {
      errors.firstName = 'First Name is required';
    }

    if (!lastName.trim()) {
      errors.lastName = 'Last Name is required';
    }

    if (!username.trim()) {
      errors.username = 'Username is required';
    }

    if (!phone.trim()) {
      errors.phone = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(phone)) {
      errors.phone = 'Phone Number must be 10 digits';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:3000/api/signup', {
          first_name: firstName,
          last_name: lastName,
          username: username,
          phone_number: phone,
          password: password,
        });

        console.log('Form submitted successfully!', response.data);
        setMessage('Registration successful!'); // Set success message
        // Handle any further actions, such as redirection or displaying a success message
      } catch (error) {
        if(error.response.data.error.includes('Duplicate Entry')){
          setMessage('Registration failed. Please check the form.'); // Set error message
          setErrors({ ...errors, server: error.response.data.error || 'Server error' });
      } else{
        setMessage('Registration failed. Please check the form.'); // Set error message
        setErrors({ ...errors, server: error.response.data.error || 'Server error' });
      }

      }
    } else {
      console.log('Form validation failed');
      setMessage('Please fill in all required fields.'); // Set validation error message
    }
  };

  return (
    <>
    <Menu/>
    <div className="py-5 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-md-2 pt-5">
              
          </div>
          <div className="col-md-8 mb-5   bg-white">
            <form onSubmit={handleSubmit} className="p-5">
              <div className="row form-group">
                <div className="col-md-12 mb-3 mb-md-0">
                  <label className="font-weight-bold" htmlFor="firstname">First Name</label>
                  <input type="text" id="firstname" className="form-control" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} />
                  {errors.firstName && <p className="text-danger">{errors.firstName}</p>}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-12 mb-3 mb-md-0">
                  <label className="font-weight-bold" htmlFor="lastname">Last Name</label>
                  <input type="text" id="lastname" className="form-control" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} />
                  {errors.lastName && <p className="text-danger">{errors.lastName}</p>}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-12 mb-3 mb-md-0">
                  <label className="font-weight-bold" htmlFor="username">Username</label>
                  <input type="text" id="username" className="form-control" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                  {errors.username && <p className="text-danger">{errors.username}</p>}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-12">
                  <label className="font-weight-bold" htmlFor="phone">Phone Number</label>
                  <input type="text" id="phone" className="form-control" placeholder="Phone #" onChange={(e) => setPhone(e.target.value)} />
                  {errors.phone && <p className="text-danger">{errors.phone}</p>}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-12">
                  <label className="font-weight-bold" htmlFor="password">Password</label>
                  <input type="password" id="password" className="form-control" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                  {errors.password && <p className="text-danger">{errors.password}</p>}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-12">
                  <label className="font-weight-bold" htmlFor="confirmpassword">Confirm Password</label>
                  <input type="password" id="confirmpassword" className="form-control" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />
                  {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword}</p>}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-12">
                  {message && !errors.server && <p className={errors.server ? "text-danger" : "text-success"}>{message}</p>}
                  {errors.server && <p className="text-danger">{errors.server}</p>}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-12">
                  <input type="submit" value="Submit" className="btn text-white px-4 py-2" style={{backgroundColor : 'green', color: 'white'}} variant={'secondary'}/>
                </div>
              </div>
            </form>
          </div>
          
          </div>
      </div>
    </div>
    </>
  );
}

export default Signup;
