import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo2.png';
import Button from '../components/Button';
import TextField from '../components/TextField';

const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3002/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token); // Store JWT token in localStorage
                console.log('JWT token:', data.token); // Log token to console
                navigate('/dashboard'); // Redirect to dashboard after successful login
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.error || 'Invalid username or password');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    };
   
    return (
        <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
            <div className="container text-center">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <img
                            src={logo}
                            alt="Gym Management Logo"
                            style={{
                                width: '200px',
                                height: 'auto',
                                marginBottom: '-50px',
                            }}
                        />
                        <div
                            className="card shadow"
                            style={{ minHeight: '300px', marginBottom: '100px' }}
                        >
                            <div className="card-header text-center">
                                <h3 className="mt-0" style={{ fontWeight: 'bold', fontSize: '2rem' }}>
                                    Login
                                </h3>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="username"
                                            className="form-label text-start d-block"
                                        >
                                            <strong>Username</strong>
                                        </label>
                                        <TextField
                                            type="text"
                                            placeholder="Enter username"
                                            value={username}
                                            onChange={handleUsernameChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label
                                            htmlFor="password"
                                            className="form-label text-start d-block"
                                        >
                                            <strong>Password</strong>
                                        </label>
                                        <TextField
                                            type="password"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            required
                                        />
                                    </div>

                                    {errorMessage && (
                                        <div className="alert alert-danger" role="alert">
                                            {errorMessage}
                                        </div>
                                    )}

                                    <div className="text-center">
                                        <Button type="submit" variant="primary">
                                            Login
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
