import React, { useState } from 'react';
import './Auth.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from '../../firebase.config';

firebase.initializeApp(firebaseConfig)

const Auth = () => {
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        issigned: false,
        name: '',
        email: '',
        password: '',
        photo: '',
        error: '',
        success: false,
    })

    const handleBlur = (e) =>{
        // console.log(e.target.name, e.target.value)
        let isFieldvalid = true;
        if(e.target.name === "email"){
            isFieldvalid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value);
        }
        if(e.target.name === "password"){
            const passwordHasNumber = e.target.value.length >= 6;
            const passwordPattern = /[A-Z]/.test(e.target.value)
            isFieldvalid = passwordPattern && passwordHasNumber;
        }
        if(isFieldvalid){
            const newUserInfo = {...user}
            newUserInfo[e.target.name] = e.target.value;
            setUser(newUserInfo)
        }
    }


    const handleSubmit = (e) =>{
        // console.log(user.email, user.password)
        if(newUser && user.email && user.password){
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            .then(res => {
                const newUserInfo = {...user}
                newUserInfo.success = true;
                newUserInfo.error = '';
                setUser(newUserInfo);
                updateUserInfo(user.name)
            })
            .catch(err =>{
                const newUserInfo = {...user}
                newUserInfo.error = err.message;
                newUserInfo.success = false;
                setUser(newUserInfo)
            })
        }
        if(!newUser && user.email && user.password){
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            .then(res => {
                const newUserInfo = {...user}
                newUserInfo.success = true;
                newUserInfo.error = '';
                setUser(newUserInfo);
                updateUserInfo(user.name)
            })
            .catch(err =>{
                const newUserInfo = {...user}
                newUserInfo.error = err.message;
                newUserInfo.success = false;
                setUser(newUserInfo)
            })
        }
        e.preventDefault();
    }


    // Update User Info
    const updateUserInfo = (name) =>{
        const user = firebase.auth().currentUser;
        user.updateProfile({
            displayName: name,
          })
        .then(res => {
            console.log('Update Name successfuly')
        })
        .catch(err => {
            const errMessage = err.message;
            console.log(errMessage)
        })
    }

    return (
        <div className='auth-container'>
            <h4 className='text-center'>Simple Authentication</h4>

            <form onSubmit={handleSubmit}>
                {newUser && <input onBlur={handleBlur} type="text" name="name" className="form-control" required placeholder='Your Name'/>}
                <input onBlur={handleBlur} type="text" name="email" className="form-control my-2" required placeholder='E-mail'/>
                <input onBlur={handleBlur} type="password" name="password" className="form-control" required placeholder='Password'/>
                {
                    newUser ? <input type="submit" value="Sign Up" className='my-2 btn btn-primary'/>
                    :<input type="submit" value="Sign In" className='my-2 btn btn-primary'/>
                }
            </form>

            {/*Toggler */}
            {
                newUser ?
                <div>
                    <input onChange={()=> setNewUser(!newUser)} type="checkbox" name="newUser" id="newUser"/>
                    <label htmlFor="newUser" className='ml-2'>Log In</label>
                </div>
                : 
                <div>
                    <input onChange={()=> setNewUser(!newUser)} type="checkbox" name="newUser" id="newUser"/>
                    <label htmlFor="newUser" className='ml-2'>Sign Up</label>
                </div>
            }

            <p style={{color: 'tomato'}}>{user.error}</p>
            {user.success && <p style={{color:'green'}}>User {newUser ? 'create' : 'Logged'} success fully</p>}
        </div>
    );
};

export default Auth;