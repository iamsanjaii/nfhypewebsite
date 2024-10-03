import React from 'react'
import {Link, Navigate} from 'react-router-dom'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { auth } from './assets/firebase/firebasecongfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import {  useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in Successfully")
      navigate('/home')
      console.log("User logged in Successfully");
    } catch (error) {
      toast.error(alert.image)
    }
  };
  return (
   <div className="app">
     <div className="container">
    <div>
        <img src="/icon.png" alt="" height='100px'/>
        <h3>Login to Nittfest</h3>
    </div>
    <div className='register-field'>
  <form action="" onSubmit={handleSubmit}>
  <input type="text" placeholder='Email' onChange={(e)=>setEmail(e.target.value)} />
           
           <input type="text" placeholder='Password' onChange={(e)=>setPassword(e.target.value)} />
           <div className="buttons">
        <button>Log In</button>
        <Link to='/' className='an-link'><p>Don't Have Account?</p></Link>
      
    </div>
  </form>
    </div>

  </div>
   </div>
  )
}

export default Login
