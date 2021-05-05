import React, { useEffect, useState, useReducer } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  RouteComponentProps,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import API from "./utils/API";
import { testDatabase } from "./utils/db";
import "./App.css";
import CustomizedSnackbar from "./components/SnackBar";
import {
  ThemeProvider,
  createMuiTheme,
  Theme,
  makeStyles,
  createStyles,
} from "@material-ui/core/styles";
import { green, blueGrey, deepPurple } from "@material-ui/core/colors";
import { MuiPickersOverrides } from "@material-ui/pickers/typings/overrides";
import {
  CssBaseline,
  ThemeOptions,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { useAuth } from "./Context/Auth";
import { useStateContext } from "./Context/State";

// Types to allow for theme customization
type overridesNameToClassKey = {
  [P in keyof MuiPickersOverrides]: keyof MuiPickersOverrides[P];
};
type CustomType = {
  MuiPickersBasePicker: {
    pickerView: {
      maxWidth?: string;
    };
  };
};
declare module "@material-ui/core/styles/overrides" {
  interface ComponentNameToClassKey extends overridesNameToClassKey {}
  export interface ComponentNameToClassKey extends CustomType {}
}

// Instantiating default theme to use breakpoints
const defaultTheme = createMuiTheme();

// Theme factory
function createMyTheme(options: ThemeOptions) {
  return createMuiTheme({
    overrides: {
      MuiPickersBasePicker: {
        container: {
          backgroundColor: blueGrey[900],
          [defaultTheme.breakpoints.down("xs")]: {
            marginLeft: "-10px",
          },
        },
      },
      MuiCard: {
        root: {
          backgroundColor: blueGrey[900],
        },
      },
      MuiDialogContent: {
        root: {
          backgroundColor: blueGrey[900],
        },
      },
      MuiPickersCalendarHeader: {
        iconButton: {
          backgroundColor: blueGrey[900],
        },
      },
    },
    ...options,
  });
}

// Adding global palette colors
const theme = createMyTheme({
  palette: {
    type: "dark",
    background: {
      default: blueGrey[900],
    },
    primary: {
      main: green[900],
    },
    secondary: {
      main: deepPurple[800],
    },
  },
});

// Check if user is logged in before returning protected component/page
const ProtectedRoute = ({
  component: Component,
  loggedIn,
  ...rest
}: {
  path: string;
  loggedIn: boolean;
  setLoggedIn: Function;
  component: React.FunctionComponent<RouteComponentProps>;
}): JSX.Element => (
  <Route
    {...rest}
    render={(props) =>
      loggedIn ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

export default function App() {
  const { Auth, setAuth } = useAuth();
  const { alertState, setAlertState, loading } = useStateContext();

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      backdrop: {
        zIndex: 1301, // To be in front of Dialog at 1300
        color: "#fff",
      },
    })
  );

  const classes = useStyles();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token) {
      API.checkAuth(token)
        .then((res) =>
          setAuth({
            type: "LOGIN",
            payload: { user: res.username, token: token },
          })
        )
        .catch((err) => {
          if (err.message === "Unauthorized") {
            setAuth({ type: "LOGOUT" });
          } else {
            setAuth({
              type: "LOGIN",
              payload: { user: user || "", token: token || "" },
            });
          }
        });
    }
  }, []);

  useEffect(() => {
    testDatabase();
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ProtectedRoute
          path="/"
          loggedIn={Auth.loggedIn}
          setLoggedIn={setAuth}
          component={Home}
        />
        <Route exact path="/login">
          <Login />
        </Route>
      </Router>
      <CustomizedSnackbar state={alertState} setState={setAlertState} />
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress disableShrink color="inherit" />
      </Backdrop>
    </ThemeProvider>
  );
}
