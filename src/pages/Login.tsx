import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import API from '../utils/API'
import { AuthContext } from '../App'
import { Button, TextField, Dialog, Container } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Signup from '../components/Signup'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            flexWrap: 'wrap',
            '& > *': {
                margin: theme.spacing(1),
                [theme.breakpoints.down('xs')]: {
                    width: '100%',
                },
            }
        },
        signupBtn: {
            float: 'right',
            margin: '1em',
        },
    })
);

export default function Login() {
    const { Auth, setAuth, setAlertState, setOpenBackdrop } = React.useContext(AuthContext)

    const [loginFormState, setLoginFormState] = useState({
        username: "",
        password: "",
    });

    const [signupOpen, setSignupOpen] = useState<boolean>(false)

    const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setLoginFormState({
            ...loginFormState,
            [name]: value,
        });
    };

    const formSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        setOpenBackdrop(true)
        try {
            let newToken = await API.login(loginFormState)
            setAuth({ type: 'LOGIN', payload: { user: loginFormState.username, token: newToken.token } })
        } catch (err) {
            console.error(err)
            setAlertState({
                severity: "error",
                message: "Incorrect username or password",
                open: true
            })
        } finally {
            setOpenBackdrop(false)
        }
    }

    const classes = useStyles()

    function handleClose() {
        setSignupOpen(false)
    }

    if (Auth.loggedIn) {
        return <Redirect to='/' />
    }

    return (
        <>
            <Button
                className={classes.signupBtn}
                variant="contained"
                color="primary"
                onClick={() => setSignupOpen(true)}
            >Sign Up</Button>
            <Container className={classes.root}>
                <h4>Login</h4>
                    </Container>
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
            <Dialog onClose={handleClose} open={signupOpen} maxWidth='xl'>
                <Signup handleClose={handleClose}/>
            </Dialog>
        </>
    );
}