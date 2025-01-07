import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Password from '../components/Password'
import { validEmail } from '../utils/errorHandler';
import axiosInstance from '../utils/axiosInstance.js';
import Header from '../components/Header.jsx';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validEmail(email)) {
            setError('Please enter a valid email address!');
            return;
        }
        if (!password) {
            setError('Please enter a password!');
            return;
        }
        setError("")
        
        try {
            const response = await axiosInstance.post('server/auth/login', {
                email,
                password,
            });

            if (response.data && response.data.access_token) {
                localStorage.setItem('access_token', response.data.access_token);
                navigate('/dashboard');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
            else {
                setError('Something went wrong. Please try again later.');
            }
        }
    };

  return (
    <>
        <Header 
                userInfo={null} 
                onSearch={() => {}}
                clearSearch={() => {}}
            />
        <div className="flex items-center justify-center mt-28">
            <div className="w-96 border rounded bg-white px-7 py-10">
                <form onSubmit={handleSubmit}>
                    <h4 className='text-2xl mb-7'>Login</h4>
                    <input type="text" placeholder='Email' className='input-box'
                        value={email} onChange={(e) => setEmail(e.target.value)}/>

                    <Password value={password} onChange={(e) => setPassword(e.target.value)}/>

                    {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
                    <button type='submit'className='btn-primary' >Login</button>
                    <p className='text-sm text-center mt-4'>
                        Not registered yet?{' '}
                        <Link to="/signup" className='font-medium text-primary underline'>
                            Create an account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    </>
  )
}

export default Login