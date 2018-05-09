import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { Menu, Icon, Button } from 'semantic-ui-react'

import { loggedOut } from '../store/actions'

class Navigation extends Component {
	buttonLogoutClick = (e) => {
		if (window.confirm('Выйти из системы?')) {
			this.props.loggedOut()

			this.props.history.push('/')
		}
	}

	render() {
		var { pathname } = this.props.location

		return (
			<Menu as="nav" fixed="top" stackable>
        <Menu.Item
        	as={Link} 
        	to="/"
          active={pathname === '/'}
        >
          <Icon name="eye" />ACS
        </Menu.Item>

        <Menu.Item
          as={Link} 
        	to="/passages"
          active={!!pathname.match(new RegExp('^/passages'))}
        >
          Мониторинг
        </Menu.Item>

        <Menu.Item
          as={Link} 
        	to="/archive"
          active={!!pathname.match(new RegExp('^/archive'))}
        >
          Архив
        </Menu.Item>

        <Menu.Menu position='right'>
        	<Menu.Item>
        		{
        			this.props.authenticated
        			?
	          	<Button onClick={this.buttonLogoutClick} primary>Logout</Button>
	          	:
	          	<Button as={Link} to={{ pathname: '/login', state: { from: this.props.location } }} primary>Login</Button>
        		}
        	</Menu.Item>
        </Menu.Menu>
      </Menu>
    )
	}	
} 

export default withRouter(connect(state => ({ authenticated: state.authentication.is }), dispatch => ({ loggedOut: () => { dispatch(loggedOut()) } }) )(Navigation))