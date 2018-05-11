import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const PrivateRoute = ({ authenticated, component: Component, ...rest }) => (
	<Route 
		{...rest}
		render={props => authenticated ? <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}		
	/>
)

export default connect(state => ({ authenticated: !!state.authentication.user.jwt }))(PrivateRoute)