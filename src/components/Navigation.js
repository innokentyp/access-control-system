import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Menu, Icon, Dropdown } from 'semantic-ui-react'

import * as actions from '../store/actions/authentication'

class Navigation extends Component {
  state = {
    colors: ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']
  }

	logoutClick = (e) => {
		if (window.confirm('Выйти из системы?')) {
			this.props.actions.logout()

			this.props.history.push('/')
		}
	}

  personalClick = (e, data) => {
    const id = window.sessionStorage.getItem('subjects-selected-id')

    if (id) {
      e.preventDefault()

      this.props.history.push(data.to + '/' + id)
    }
  }

	render() {
		var { pathname } = this.props.location
    var { colors } = this.state
    var { user } = this.props

		return (
			<Menu as="nav" fixed="top" stackable>
        <Menu.Item
        	as={Link} 
        	to="/"
          active={pathname === '/'}
          color={colors[0]}
        >
          <Icon name="home" />ACS  
        </Menu.Item>

        <Menu.Item
          as={Link} 
        	to="/passages"
          active={!!pathname.match(new RegExp('^/passages'))}
          color={colors[1]}
        >
          Мониторинг
        </Menu.Item>

        <Menu.Item
          as={Link} 
        	to="/archive"
          active={!!pathname.match(new RegExp('^/archive'))}
          color={colors[2]}
        >
          Архив
        </Menu.Item>

        <Menu.Item
          as={Link} 
          to="/structure"
          active={!!pathname.match(new RegExp('^/structure'))}
          color={colors[3]}
        >
          Офис
        </Menu.Item>

        <Menu.Item
          as={Link} 
        	to="/personal"
          active={!!pathname.match(new RegExp('^/personal'))}
          color={colors[4]}
          onClick={this.personalClick}
        >
          Персонал
        </Menu.Item>

        <Menu.Item
          as={Link} 
          to="/access"
          active={!!pathname.match(new RegExp('^/access'))}
          color={colors[5]}
        >
          Сценарий
        </Menu.Item>

        <Menu.Item
          as={Link} 
          to="/accounting"
          active={!!pathname.match(new RegExp('^/accounting'))}
          color={colors[6]}
        >
          Учет
        </Menu.Item>

        <Menu.Item
          as={Link} 
          to="/security"
          active={!!pathname.match(new RegExp('^/security'))}
          color={colors[7]}
        >
          Безопасность
        </Menu.Item>


        <Menu.Menu position='right'>
          {
      			user.jwt
      			?
          	<Dropdown item text={`[ ${user.name.slice(0, 1).toUpperCase()}${user.name.slice(1)} ]`}>
              <Dropdown.Menu>
                <Dropdown.Item text='Персональные данные' />
                <Dropdown.Item text='Журнал' />
                <Dropdown.Item text='Настройка' />
                <Dropdown.Item text='Конфиденциальность' />
                <Dropdown.Divider />
                <Dropdown.Item text='Выйти' onClick={this.logoutClick} />
              </Dropdown.Menu>
            </Dropdown>
          	:
            <Menu.Item 
              as={Link} 
              to={{ pathname: '/login', state: { from: this.props.location } }}
              active={!!pathname.match(new RegExp('^/login'))}
            >
              Login
            </Menu.Item>          	
      		}
        </Menu.Menu>
      </Menu>
    )
	}	
} 

export default withRouter(
  connect(
    state => (
      { 
        user: state.authentication.user
      }
    ), 
    dispatch => (
      { 
        actions: bindActionCreators(actions, dispatch)      
      }
    ) 
  )(Navigation)
)