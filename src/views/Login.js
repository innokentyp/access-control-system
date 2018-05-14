import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Container, Form, Button, Message } from 'semantic-ui-react'

import * as actions from '../store/actions/authentication'

class Login extends Component {
	state = {
		loading: false,
		warning: {},
		error: {}	
	}

	constructor(props) {
    super(props)

    this.inputUser = React.createRef()
    this.inputPassword = React.createRef()
  }

  validate = (e) => {
  	var warning = {}
		var validated = true

		if (!e.target.user.value) {
			warning.user = 'Имя пользователя не может быть пустым'
			
			validated = false
			this.inputUser.current.focus()
		}

		if (!e.target.password.value) {
			warning.password = 'Пароль не может быть пустым'
			
			if (validated) {
				validated = false
				this.inputPassword.current.focus()
			}
		}

		this.setState({ warning })

		return validated
  }

	formLoginSubmit = (e) => {
		e.preventDefault()

		this.setState({ error: {} })

		if (this.validate(e)) {
			this.setState({ loading: true })

			this.props.actions.login({ name: e.target.user.value, password: e.target.password.value, remember: e.target.remember.checked })
				.then (
					() => {
						let { history, location } = this.props

						location.state ? history.push(location.state.from.pathname === location.pathname ? '/' : location.state.from.pathname) : history.push('/')
					}
				)
				.catch (
				  (error) => {
				  	this.setState({ loading: false, error })

				  	this.inputUser.current.select()				    
				  }
			  )
			  .finally (
					() => {
						;
					}
				)				
		} 
	}

	formLoginReset = (e) => {
		this.setState({ warning: {}, error: {} })

		this.inputUser.current.focus()
	}

	render() {
		var { loading, warning, error } = this.state

		return (
			<Container as="section" text>
				<h3>Login match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>
				
				<Form name="form-login" onSubmit={this.formLoginSubmit} onReset={this.formLoginReset} autoComplete="off" loading={loading} error={!!Object.keys(error).length} warning={!!Object.keys(warning).length}>		
		      <Form.Field error={!!warning['user']}>
		      	<label htmlFor="form-login-user">Имя пользователя:</label>
			      <input ref={this.inputUser} type="text" name="user" id="form-login-user" autoComplete="nope" autoCorrect="off" autoCapitalize="off" spellCheck="false" autoFocus />
		      </Form.Field>

			    <Form.Field error={!!warning['password']}>
			      <label htmlFor="form-login-password">Пароль:</label>
			      <input ref={this.inputPassword} type="password" name="password" id="form-login-password" autoComplete="new-password" />
			    </Form.Field>

		      <Form.Checkbox name="remember" label="Запомнить меня" />

		      <Message
			      warning
			      header="Ошибки при вводе данных"
			      list={Object.values(warning)}
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
			authenticated: !!state.authentication.user.jwt
		}
	), 
	dispatch => (
		{ 
			actions: bindActionCreators(actions, dispatch)			
		}
	)
)(Login)