import React from 'react'
import ReactDOM from 'react-dom'

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import reducer, { preloadedState } from './store/reducers'

it('renders without crashing', 
	() => {
	  const div = document.createElement('div')
	  
	  ReactDOM.render(
	  	<Provider store={createStore(reducer, preloadedState)}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</Provider>, 
			div
		)
	  
	  ReactDOM.unmountComponentAtNode(div)
	}
)
