import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import API from '../utils/API'
import {AuthContext} from '../App'

export default function Login() {
    const {Auth, setAuth} = React.useContext(AuthContext)

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
        API.login(loginFormState).then(newToken => {
            setAuth({type: 'LOGIN', payload: {user: 'blarvis', token: newToken.token}})
        }).catch(err => setFailure(true))
    }

    if (Auth.loggedIn) {
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