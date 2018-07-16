import React from 'react'
//import { render, unmountComponentAtNode } from 'react-dom'
//import ReactTestUtils from 'react-dom/test-utils'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

//import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import configureMockStore from 'redux-mock-store'

import App from './App'
import Home from './views/Home'
import Login from './views/Login'
import Passages from './views/Passages'
import NoMatch from './views/NoMatch'

import /*reducer, */{ preloadedState } from './store/reducers'

const middlewares = []
const mockStore = configureMockStore(middlewares)

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
					<Provider store={mockStore(preloadedState)}>
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
					<Provider store={mockStore(preloadedState)}>
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
					<Provider store={mockStore(state)}>
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
					<Provider store={mockStore(preloadedState)}>
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
				
				const Assert = withRouter(
					class _Assert extends React.Component {
						componentDidMount() {
							const { location: { pathname }, history } = this.props

							expect(pathname).toMatch(new RegExp('/$'))

							history.push('/passages')
						}

						componentDidUpdate() {
							const { location: { pathname } } = this.props

							expect(pathname).toMatch(new RegExp('/passages$'))
						}

						render = () => <App />						
					}
				) 

				const wrapper = mount(
					<Provider store={mockStore(state)}>
						<MemoryRouter initialEntries={[ '/' ]}>
							<Assert />
						</MemoryRouter>
					</Provider>
				)

				expect(wrapper.find('Link[to="/passages"]')).toHaveLength(1)
				expect(wrapper.find(Passages)).toHaveLength(1)

				/*
				const div = document.createElement('div')

				class _Assert extends React.Component {
					componentDidMount() {
						const { location: { pathname }, history } = this.props

						console.log(`1: ${pathname}`)

						const link = div.querySelector('[href="/passages"]')
						expect(link).not.toBeNull()

						//ReactTestUtils.Simulate.click(link)
						history.push('/passages')
					}

					componentDidUpdate() {
						const { location: { pathname } } = this.props

						console.log(`2: ${pathname}`)

						expect(pathname).toMatch(new RegExp('/passages$'))
					}

					render = () => <App />						
				}

				const Assert = withRouter(_Assert) 

				render(
					<Provider store={createStore(reducer, state)}>
						<MemoryRouter initialEntries={[ '/' ]}>
							<Assert />
						</MemoryRouter>
					</Provider>, 
					div
				)

				unmountComponentAtNode(div)
				*/
			}
		)		

	}
)	