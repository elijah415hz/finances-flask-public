import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Redirect, RouteComponentProps } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import API from './utils/API'
import './App.css';

// import Auth from './utils/Auth'

interface Auth {
  loggedIn: boolean,
  user: string,
  token: string
}

interface AuthState {
  Auth: Auth,
  setAuth: React.Dispatch<{ type: string; payload?: { user: string; token: string; } | undefined; }>
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

  export const AuthContext = React.createContext<AuthState>({
    Auth: {
      loggedIn: false,
      user: "",
      token: ""
    },
    setAuth: (): void => {}
  })
  
  const reducer = (state: Auth, action: {type: string, payload?: {user: string, token: string}}): Auth => {
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

  export default function App() {
  const [Auth, setAuth] = React.useReducer(reducer, {
    loggedIn: false,
    user: "",
    token: ""
  })
    
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      API.checkAuth(token)
      .then(res => setAuth({type: 'LOGIN', payload: {user: res.username, token: token}}))
      .catch(err => {
        // setAuth({type: 'LOGOUT'})
      })
    }
  }, [])

  return (
    <AuthContext.Provider
    value={{Auth, setAuth}}
    >
      <Router>
        <ProtectedRoute path="/"
          loggedIn={Auth.loggedIn}
          setLoggedIn={setAuth}
          component={Home}
        />
        <Route exact path="/login">
          <Login />
        </Route>
      </Router>
    </AuthContext.Provider>
  )
}