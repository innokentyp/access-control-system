import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Container, Form, Button, Checkbox, Message } from 'semantic-ui-react'

import { login } from '../store/actions'

class Login extends Component {
	state = {}

	constructor(props) {
    super(props)

    this.inputUser = React.createRef()
  }

	formLoginSubmit = (e) => {
		e.preventDefault()

		this.props.login({ name: e.target.user.value, password: e.target.password.value, remember: e.target.remember.checked })
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.authenticated) {
			let { history, location } = nextProps

			location.state ? history.push(location.state.from.pathname === location.pathname ? '/' : location.state.from.pathname) : history.goBack()
		}

		return prevState
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
	  if (this.props.message) {
    	this.inputUser.current.select()
  	}
	}

	render() {
		var { message } = this.props

		return (
			<Container as="section" text>
				<h3>Login match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>
				
				<Form name="form-login" onSubmit={this.formLoginSubmit} autoComplete="off" error={!!message}>		
					<Form.Field>
			      <label htmlFor="form-login-user">Имя пользователя:</label>
			      <input ref={this.inputUser} type="text" name="user" id="form-login-user" autoComplete="nope" autoCorrect="off" autoCapitalize="off" spellCheck="false" autoFocus />
			    </Form.Field>
			    <Form.Field>
			      <label htmlFor="form-login-password">Пароль:</label>
			      <input type="password" name="password" id="form-login-password" autoComplete="new-password" />
			    </Form.Field>
			    <Form.Field>
			      <Checkbox name="remember" label="Запомнить меня" />
			    </Form.Field>
			
					{
						message
						?
						<Message
				      error
				      header="Неверное имя пользователя или пароль"
				      content={message}
				    />
						:
						''
					}					

			    <Button type="submit">Login</Button>
			  </Form>
			</Container>
		)
	} 
}

export default connect(
	state => (
		{ 
			authenticated: !!state.authentication.user.jwt, 
			message: state.authentication.message 
		}
	), 
	dispatch => (
		{ 
			login: (credentials) => { dispatch(login(credentials)) } 
		}
	)
)(Login)