import React from 'react'
import { Link } from 'react-router-dom'

import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import App from './App'
import Home from './views/Home'
import Login from './views/Login'
import Passages from './views/Passages'
import NoMatch from './views/NoMatch'

import reducer, { preloadedState } from './store/reducers'

configure({ adapter: new Adapter() })

describe('App', 
	() => {
		it('renders without crashing', 
			() => {
			  shallow(<App />)			  
			}
		)

		it('navigate to public route without logged in', 
			() => {
				const wrapper = mount(
					<Provider store={createStore(reducer, preloadedState)}>
						<MemoryRouter initialEntries={[ '/' ]}>
							<App />
						</MemoryRouter>
					</Provider>
				)

				expect(wrapper.find(Home)).toHaveLength(1)
			}
		)

		it('show login if navigate to private route', 
			() => {
				const wrapper = mount(
					<Provider store={createStore(reducer, preloadedState)}>
						<MemoryRouter initialEntries={[ '/passages' ]}>
							<App />
						</MemoryRouter>
					</Provider>
				)

				expect(wrapper.find(Login)).toHaveLength(1)
			}
		)

		it('navigate to private route if logged in', 
			() => {
				const state = { 
					...JSON.parse(JSON.stringify(preloadedState)), 
					authentication: {
				    user: {
				    	name: 'user', 
				    	jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidXNlciIsInBhc3N3b3JkIjoiMTIzNDU2In0.F1kpu314aOcXQjugsxi8XZzV4dWqE7qyOMcxzJN7zTI'
				    }
				  }
				}

				const wrapper = mount(
					<Provider store={createStore(reducer, state)}>
						<MemoryRouter initialEntries={[ '/passages' ]}>
							<App />
						</MemoryRouter>
					</Provider>
				)

				expect(wrapper.find(Passages)).toHaveLength(1)				
			}
		)

		it('navigate to no match if route no match', 
			() => {
				const wrapper = mount(
					<Provider store={createStore(reducer, preloadedState)}>
						<MemoryRouter initialEntries={[ '/qwerty' ]}>
							<App />
						</MemoryRouter>
					</Provider>
				)

				expect(wrapper.find(NoMatch)).toHaveLength(1)
			}
		)

		it('navigate on click after logged in', 
			() => {
				const state = { 
					...JSON.parse(JSON.stringify(preloadedState)), 
					authentication: {
				    user: {
				    	name: 'user', 
				    	jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidXNlciIsInBhc3N3b3JkIjoiMTIzNDU2In0.F1kpu314aOcXQjugsxi8XZzV4dWqE7qyOMcxzJN7zTI'
				    }
				  }
				}

				const wrapper = mount(
					<Provider store={createStore(reducer, state)}>
						<MemoryRouter initialEntries={[ '/' ]}>
							<App />
						</MemoryRouter>
					</Provider>
				)

				expect(wrapper.find(Home)).toHaveLength(1)

				const link = wrapper.find(Link).filter('[to="/passages"]')
				expect(link).toHaveLength(1)				

				link.simulate('click')
				wrapper.update()

				//console.log(wrapper.debug())

				//expect(wrapper.find(Passages)).toHaveLength(1)
			}
		)		

	}
)	