import React, { useEffect, useState, useReducer } from 'react'
import { BrowserRouter as Router, Route, Redirect, RouteComponentProps } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import API from './utils/API'
import { testDatabase } from './utils/db'
import './App.css';
import CustomizedSnackbar from './components/SnackBar'
import { alertStateType } from './interfaces/Interfaces'

// import Auth from './utils/Auth'

interface Auth {
  loggedIn: boolean,
  user: string,
  token: string
}

interface ContextState {
  Auth: Auth,
  setAuth: React.Dispatch<{ type: string; payload?: { user: string; token: string; } | undefined; }>,
  setAlertState: React.Dispatch<React.SetStateAction<alertStateType>>
}

const ProtectedRoute = ({ component: Component, loggedIn, ...rest }: {
  path: string,
  loggedIn: boolean,
  setLoggedIn: Function,
  component: React.FunctionComponent<RouteComponentProps>,
}): JSX.Element => (
    <Route {...rest} render={props => (
      loggedIn
        ? <Component {...props} />
        : <Redirect to='/login' />
    )
    } />

  )

export const AuthContext = React.createContext<ContextState>({
  Auth: {
    loggedIn: false,
    user: "",
    token: ""
  },
  setAuth: (): void => { },
  setAlertState: (): void => {}
})



export default function App() {

  const reducer = (state: Auth, action: { type: string, payload?: { user: string, token: string } }): Auth => {
    if (action.type === 'LOGIN' && action.payload) {
      localStorage.setItem("user", action.payload.user);
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        loggedIn: true,
        user: action.payload.user,
        token: action.payload.token
      };
    } else if (action.type === 'LOGOUT') {
      localStorage.clear();
      return {
        ...state,
        loggedIn: false,
        user: "",
        token: "",
      };
    } else {
      return state;
    }
  };

  const [Auth, setAuth] = useReducer(reducer, {
    loggedIn: false,
    user: "",
    token: ""
  })

  const [alertState, setAlertState] = useState<alertStateType>({
    severity: undefined,
    message: "",
    open: false,
  })


  useEffect(() => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")
    if (token) {
      API.checkAuth(token)
        .then(res => setAuth({ type: 'LOGIN', payload: { user: res.username, token: token } }))
        .catch(err => {
          if (err.message === "Unauthorized") {
            setAuth({ type: 'LOGOUT' })
          } else {
            setAuth({ type: 'LOGIN', payload: { user: user || "", token: token || "" } })
          }
        })
    }
  }, [])


  useEffect(() => {
    testDatabase()
  })

  return (
    <AuthContext.Provider
      value={{ Auth, setAuth, setAlertState }}
    >

      <Router>
        <ProtectedRoute path="/"
          loggedIn={Auth.loggedIn}
          setLoggedIn={setAuth}
          // offline={offline}
          component={Home}
        />
        <Route exact path="/login">
          <Login />
        </Route>
      </Router>
      <CustomizedSnackbar
        state={alertState}
        setState={setAlertState}
      />
    </AuthContext.Provider>
  )
}