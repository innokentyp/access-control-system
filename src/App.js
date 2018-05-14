import React, { Component, Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'

//import logo from './logo.svg'
//import './App.css'

import Navigation from './components/Navigation'
import PrivateRoute from './routes/PrivateRoute'

import Home from './views/Home'
import Passages from './views/Passages'
import Archive from './views/Archive'
import Personal from './views/Personal'

import Login from './views/Login'
import NoMatch from './views/NoMatch'

class App extends Component {
  render() {
    return (
      <Fragment>
        <Navigation />

        <Switch>
          <Route path='/' exact component={Home} />
          
          <PrivateRoute path='/passages' component={Passages} />
          <PrivateRoute path='/archive' component={Archive} />
          <PrivateRoute path='/personal' component={Personal} />

          <Route path='/login' exact component={Login} />
          <Route component={NoMatch} />
        </Switch>
      </Fragment>
    )
  }
}

/*
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    )
  }
}
*/

export default App
