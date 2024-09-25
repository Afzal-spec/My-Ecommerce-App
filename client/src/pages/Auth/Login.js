import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import "../../styles/AuthStyles.css";
import { useAuth } from '../../context/auth';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const [auth, setAuth] = useAuth();
    
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/auth/login`,
                { email, password }
            );
            setLoading(false); // Set loading to false
            if (res && res.data.success) {
                toast.success(res.data.message);
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token,
                });
                localStorage.setItem('auth', JSON.stringify(res.data));
                navigate(location.state || '/');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            setLoading(false); // Set loading to false
            const errorMessage = error.response?.data?.message || 'Something went wrong';
            toast.error(errorMessage); // Improved error message
        }
    }

    return (
        <Layout title="Login - Ecommerce App">
            <div className='form-container'>
                <h1>Login Form</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control" 
                            placeholder='Enter Your Email'
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control" 
                            placeholder='Enter Your Password'
                            required
                        />
                    </div>
                    <div className='mb-3'>
                        <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={() => { navigate('/forgot-password') }}
                        >
                            Forgot Password
                        </button>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </Layout>
    );
}

export default Login;
