import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Container, Form, Button, Message, Grid, Segment, Header, Icon } from 'semantic-ui-react'

import * as actions from '../store/actions/authentication'

class Login extends Component {
	state = {
		loading: false,
		warning: {},
		error: {}	
	}

  validate = (e) => {
  	var warning = {}
		var validated = true

		if (!e.target.user.value) {
			warning.user = 'Имя пользователя не может быть пустым'
			
			validated = false
			this.inputUser.focus()
		}

		if (!e.target.password.value) {
			warning.password = 'Пароль не может быть пустым'
			
			if (validated) {
				validated = false
				this.inputPassword.focus()
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
						if (this.props.authenticated) {
							const { history, location } = this.props

							location.state ? history.replace(location.state.from.pathname === location.pathname ? '/' : location.state.from.pathname) : history.replace('/')
						} else {
							this.setState({ loading: false, error: { message: 'Unable to find user' } })

				  		this.inputUser.select()
				  	}
					}
				)
				.catch (
				  (error) => {
				  	this.setState({ loading: false, error })

				  	this.inputUser.select()				    
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

		this.inputUser.focus()
	}

	render() {
		var { loading, warning, error } = this.state

		return (
			<Container as="section">
				<Grid stackable centered columns={16}>
					<Grid.Row>
						<Grid.Column width={8}>
							<Segment secondary padded="very" loading={loading}>
								<Header as="h3" icon textAlign="center" color="blue">
						      <Icon name="lock" circular />
						      <Header.Subheader>Вход в систему</Header.Subheader>
						    </Header>

								<Form name="form-login" onSubmit={this.formLoginSubmit} onReset={this.formLoginReset} autoComplete="off" error={!!Object.keys(error).length} warning={!!Object.keys(warning).length}>		
						      <Form.Field error={!!warning['user']}>
						      	<label htmlFor="form-login-user">Имя пользователя:</label>
							      <input ref={el => this.inputUser = el} type="text" name="user" id="form-login-user" autoFocus />
						      </Form.Field>

							    <Form.Field error={!!warning['password']}>
							      <label htmlFor="form-login-password">Пароль:</label>
							      <input ref={el => this.inputPassword = el} type="password" name="password" id="form-login-password" autoComplete="new-password" />
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
						  </Segment>
			  		</Grid.Column>
					</Grid.Row>
				</Grid>
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