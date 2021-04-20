import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import API from '../utils/API'
import { useAuth } from '../Context/Auth'
import { Button, TextField, Dialog, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Signup from '../components/Signup'
import { useStateContext } from '../Context/State';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1
        },
        heading: {
            textAlign: 'center',
            fontFamily: 'Times New Roman, serif'
        },
        signupBtn: {
            float: 'right',
            margin: '1em',
        },
        sidebar: {
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            flexWrap: 'wrap',
        },
        form: {
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            flexWrap: 'wrap',
            '& > *': {
                margin: theme.spacing(1),
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
                flexWrap: 'wrap',
                [theme.breakpoints.down('xs')]: {
                    width: '100%',
                },
            }
        },
        link: {
            color: theme.palette.primary.main,
            '&:hover': theme.palette.secondary.main 
        }
    })
);

export default function Login() {
    const {Auth, setAuth } = useAuth()
    const {setAlertState, setOpenBackdrop} = useStateContext()
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
            <Grid container className={classes.root}>
                <Grid item xs={12}>
                    <Typography variant="h1" component="h2" gutterBottom className={classes.heading}>
                        Flask of Finances
                    </Typography>
                </Grid>
                <Grid item xs={12} className={classes.sidebar}>
                    <form className={classes.form} onSubmit={formSubmit}>
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
                            </Grid>
                        <Grid item xs={12} className={classes.sidebar}>

            <Button
                className={classes.link}
                onClick={() => setSignupOpen(true)}
            >Sign Up</Button>
            </Grid>
            </Grid>
            <Dialog onClose={handleClose} open={signupOpen} maxWidth='xl'>
                <Signup handleClose={handleClose} />
            </Dialog>
        </>
    );
}