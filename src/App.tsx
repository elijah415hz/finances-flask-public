import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Redirect, RouteComponentProps } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import API from './utils/API'
import './App.css';

// import Auth from './utils/Auth'


const ProtectedRoute = ({ component: Component, isLoggedIn, ...rest }: {
  path: string,
  isLoggedIn: boolean,
  setIsLoggedIn: Function,
  component: React.FunctionComponent<RouteComponentProps>,
}): JSX.Element => (
    <Route {...rest} render={props => (
      isLoggedIn
          ? <Component {...props} />
          : <Redirect to='/login' />
      )
    } />

  )

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    API.checkAuth(token)
      .then(res=>setIsLoggedIn(true))
      .catch(err=>{
        setIsLoggedIn(false)
        localStorage.removeItem("token")
      })
  }, [])

  return (
    <Router>
      <ProtectedRoute path="/"
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        component={Home}
      />
      <Route exact path="/login">
        <Login
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn} />
      </Route>
    </Router>
  )
}