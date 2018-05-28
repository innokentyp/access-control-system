import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import decode from 'jwt-decode'

import 'semantic-ui-css/semantic.min.css'

import './index.css'

import configureStore from './store/'
import { loggedIn } from './store/actions/authentication'
import App from './App'

import registerServiceWorker from './registerServiceWorker'

const store = configureStore()

// login
try {
	let jwt = window.sessionStorage.getItem('jwt')

	if (jwt) {
	  store.dispatch(loggedIn({ name: decode(jwt).name, jwt }))
	}
} catch (e) {
	console.log(e.message)
}

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>, 
	document.getElementById('root')
)

registerServiceWorker()
