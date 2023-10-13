import { MouseEventHandler, useState } from 'react';
import React from 'react';

export interface LoginProps {
  handleOnLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = (props) => {
  const [username, setUsername] = useState('');

  const handleOnLogin: MouseEventHandler = (e) => {
    e.preventDefault();

    props.handleOnLogin(username);
  };

  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center px-1'>
      <p className='text-center text-4xl'>Welcome to Whisper (A Chat App)</p>
      <p className='mt-2 text-center text-lg italic'>Please enter your username to proceed</p>
      <br />
      <form className='flex flex-col'>
        <input className='border-b-2 text-center outline-none' onChange={e => setUsername(e.target.value)} type='text' placeholder='Your username'/>
        <button className='my-2 border-2 bg-slate-100 px-2 py-1' onClick={handleOnLogin} type='submit'>Proceed</button>
      </form>
    </div>
  );
}

export default Login;