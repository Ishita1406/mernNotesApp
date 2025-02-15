import React, { useState } from 'react'
import Password from '../components/Password'
import { Link, useNavigate } from 'react-router-dom';
import { validEmail } from '../utils/errorHandler';
import axiosInstance from '../utils/axiosInstance';
import Header from '../components/Header';

const SignUp = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!name) {
            setError('Please enter a username!');
            return;
        }
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
            const response = await axiosInstance.post('server/auth/signup', {
                name,
                email,
                password,
            });

            if (response.data && response.data.error) {
                setError(response.data.message);
                return;
            }

            navigate('/login');
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
                    <h4 className='text-2xl mb-7'>Sign Up</h4>
                    <input type="text" placeholder='Username' className='input-box'
                        value={name} onChange={(e) => setName(e.target.value)}/>

                    <input type="text" placeholder='Email' className='input-box'
                        value={email} onChange={(e) => setEmail(e.target.value)}/>

                    <Password value={password} onChange={(e) => setPassword(e.target.value)}/>

                    {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
                    <button type='submit'className='btn-primary' >Create Account</button>
                    <p className='text-sm text-center mt-4'>
                        Already have an account?{' '}
                        <Link to="/login" className='font-medium text-primary underline'>
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    </>
  )
}

export default SignUp