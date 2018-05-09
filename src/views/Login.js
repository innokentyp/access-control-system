import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Container, Button } from 'semantic-ui-react'

import { loggedIn } from '../store/actions'

class Login extends Component {
	buttonLoginClick = (e) => {
		let { history, location } = this.props

		this.props.loggedIn({name: 'User',password: '123456'})

		location.state ? history.push(location.state.from.pathname === location.pathname ? '/' : location.state.from.pathname) : history.goBack()
	}

	render() {
		return (
			<Container as="section">
				<h3>Login match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>
				<div>
					<Button onClick={this.buttonLoginClick} primary>Login</Button>
				</div>	
			</Container>
		)
	} 
}

export default connect(state => ({}), dispatch => ({ loggedIn: (user) => { dispatch(loggedIn(user)) } }))(Login)