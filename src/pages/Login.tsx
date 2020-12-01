import React, { useState } from 'react'
import {Redirect } from 'react-router-dom'
import API from '../utils/API'

export default function Login(props: {isLoggedIn: boolean, setIsLoggedIn: Function}) {
    const [loginFormState, setLoginFormState] = useState({
        username: "",
        password: "",
    });

    const [failure, setFailure] = useState(false)

    const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setLoginFormState({
            ...loginFormState,
            [name]: value,
        });
    };

    const formSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        console.log(loginFormState)
        API.login(loginFormState).then(newToken => {
            localStorage.setItem("token", newToken.token)
            props.setIsLoggedIn(true)
            
        }).catch(err => setFailure(true))
    }

    if (props.isLoggedIn) {
        return <Redirect to='/' />
    }

    return (
        <>
            <div className="Login">
                <form className="LoginForm" onSubmit={formSubmit}>
                    <h4>Login</h4>
                    <div className="Response">
                        {failure ? <p>Incorrect username or password</p> : null}
                    </div>
                    <input
                        onChange={inputChange}
                        value={loginFormState.username}
                        type="text"
                        name="username"
                        placeholder="username"
                    />
                    <input
                        onChange={inputChange}
                        value={loginFormState.password}
                        type="password"
                        name="password"
                        placeholder="password"
                    />
                    <button className="Btn" name="login" type="submit">Login</button>
                </form>
            </div>
        </>
    );
}