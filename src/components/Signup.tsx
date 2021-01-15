import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import API from '../utils/API'
import { AuthContext } from '../App'
import { Button, DialogContent, TextField, Container } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            '& > *': {
                margin: theme.spacing(1),
                [theme.breakpoints.down('xs')]: {
                    width: '100%',
                },
            }
        }
    })
);

export default function Signup({handleClose}: {handleClose: Function}) {
    const { setAlertState, setOpenBackdrop } = React.useContext(AuthContext)

    const [signupFormState, setSignupFormState] = useState({
        username: "",
        password: "",
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSignupFormState({
            ...signupFormState,
            [name]: value,
        });
    };

    const formSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        setOpenBackdrop(true)
        try {
            await API.signup(signupFormState)
            setAlertState({
                severity: "success",
                message: "You're signed up! Please log in",
                open: true
            })
            handleClose()
        } catch (err) {
            console.error(err)
            setAlertState({
                severity: "error",
                message: "Error Signing Up!",
                open: true
            })
        } finally {
            setOpenBackdrop(false)
        }
    }

    const classes = useStyles()

    return (
        <DialogContent>
            <div style={{ textAlign: 'center' }}>
                <h4>Signup</h4>
                <form className={classes.root} onSubmit={formSubmit}>
                    <TextField
                        onChange={handleChange}
                        value={signupFormState.username}
                        type="text"
                        name="username"
                        label="username"
                        variant="outlined"
                    />
                    <TextField
                        onChange={handleChange}
                        value={signupFormState.password}
                        type="password"
                        name="password"
                        label="password"
                        variant="outlined"
                    />
                    <Button variant="contained" color="primary" name="signup" type="submit">Sign Up</Button>
                </form>
            </div>
        </DialogContent>
    );
}