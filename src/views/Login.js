import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Container, Form, Button, Message } from 'semantic-ui-react'

import { login, loginReset } from '../store/actions'

class Login extends Component {
	state = {
		errors: {}	
	}

	constructor(props) {
    super(props)

    this.inputUser = React.createRef()
    this.inputPassword = React.createRef()
  }

  validate = (e) => {
  	var errors = {}
		var validated = true

		if (!e.target.user.value) {
			errors.user = 'Имя пользователя не может быть пустым'
			
			validated = false
			this.inputUser.current.focus()
		}

		if (!e.target.password.value) {
			errors.password = 'Пароль не может быть пустым'
			
			if (validated) {
				validated = false
				this.inputPassword.current.focus()
			}
		}

		this.setState({ errors })

		return validated
  }

	formLoginSubmit = (e) => {
		e.preventDefault()

		this.validate(e) && this.props.login({ name: e.target.user.value, password: e.target.password.value, remember: e.target.remember.checked })
	}

	formLoginReset = (e) => {
		this.setState({ errors: {} })
		this.props.loginReset()

		this.inputUser.current.focus()
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.authenticated) {
			let { history, location } = nextProps

			location.state ? history.push(location.state.from.pathname === location.pathname ? '/' : location.state.from.pathname) : history.push('/')
		}

		return prevState
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
	  if (!!Object.keys(this.props.error).length) {
    	this.inputUser.current.select()
  	}
	}

	render() {
		var { loading, error } = this.props
		var { errors } = this.state

		return (
			<Container as="section" text>
				<h3>Login match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>
				
				<Form name="form-login" onSubmit={this.formLoginSubmit} onReset={this.formLoginReset} autoComplete="off" loading={loading} error={!!Object.keys(error).length} warning={!!Object.keys(errors).length}>		
		      <Form.Field error={!!errors['user']}>
		      	<label htmlFor="form-login-user">Имя пользователя:</label>
			      <input ref={this.inputUser} type="text" name="user" id="form-login-user" autoComplete="nope" autoCorrect="off" autoCapitalize="off" spellCheck="false" autoFocus />
		      </Form.Field>

			    <Form.Field error={!!errors['password']}>
			      <label htmlFor="form-login-password">Пароль:</label>
			      <input ref={this.inputPassword} type="password" name="password" id="form-login-password" autoComplete="new-password" />
			    </Form.Field>

		      <Form.Checkbox name="remember" label="Запомнить меня" />

		      <Message
			      warning
			      header="Ошибки при вводе данных"
			      list={Object.values(errors)}
			    />
			
					<Message
			      error
			      header="Неверное имя пользователя или пароль"
			      content={error.message ? error.message : 'Нет сообщения'}
			    />
					
			    <Button type="submit" primary>Login</Button>
			    <Button type="reset">Reset</Button>			    
			  </Form>
			</Container>
		)
	} 
}

export default connect(
	state => (
		{ 
			authenticated: !!state.authentication.user.jwt,
			loading: state.authentication.loading, 
			error: state.authentication.error 
		}
	), 
	dispatch => (
		{ 
			login: (credentials) => { dispatch(login(credentials)) },
			loginReset: () => { dispatch(loginReset()) } 
		}
	)
)(Login)