import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import API from '../utils/API'
import { AuthContext } from '../App'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
createStyles({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
            // width: '15ch',
        }
    }
})
);

export default function Login() {
    const { Auth, setAuth } = React.useContext(AuthContext)

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

    const formSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        try {
            API.login(loginFormState).then(newToken => {
                console.log("Login Token: " + newToken.token)
                setAuth({ type: 'LOGIN', payload: { user: loginFormState.username, token: newToken.token } })
            })
        } catch (err) {
            console.log(err)
            setFailure(true)
        }


    }

    const classes = useStyles()


    if (Auth.loggedIn) {
        return <Redirect to='/' />
    }

   

    return (
        <>
            <div className="Login" style={{textAlign: 'center'}}>
                    <h4>Login</h4>
                    <div className="Response">
                        {failure ? <p>Incorrect username or password</p> : null}
                    </div>
                <form className={classes.root} onSubmit={formSubmit}>
                    <TextField
                        onChange={inputChange}
                        value={loginFormState.username}
                        type="text"
                        name="username"
                        label="username"
                        variant="outlined"
                    />
                    <TextField
                        onChange={inputChange}
                        value={loginFormState.password}
                        type="password"
                        name="password"
                        label="password"
                        variant="outlined"
                    />
                    <Button variant="contained" color="primary" name="login" type="submit">Login</Button>
                </form>
            </div>
        </>
    );
}