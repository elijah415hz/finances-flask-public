import React, { useState } from "react";
import API from "../utils/API";
import {
  Button,
  DialogContent,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useStateContext } from "../Context/State";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      "& > *": {
        margin: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
          width: "100%",
        },
      },
    },
    heading: {
      textAlign: "center",
      fontFamily: "Times New Roman, serif",
    },
  })
);

export default function Signup({ handleClose }: { handleClose: Function }) {
  const { setAlertState, setLoading } = useStateContext();

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
    setLoading(true);
    try {
      await API.signup(signupFormState);
      setAlertState({
        severity: "success",
        message: "You're signed up! Please log in",
        open: true,
      });
      handleClose();
    } catch (err) {
      console.error(err);
      setAlertState({
        severity: "error",
        message: "Error Signing Up!",
        open: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const classes = useStyles();

  return (
    <DialogContent>
      <div style={{ textAlign: "center" }}>
        <Typography variant="h2" component="h4" className={classes.heading}>
          Sign Up
        </Typography>
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
          <Button
            variant="contained"
            color="primary"
            name="signup"
            type="submit"
          >
            Sign Up
          </Button>
        </form>
      </div>
    </DialogContent>
  );
}
