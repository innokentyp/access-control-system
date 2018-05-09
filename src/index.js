import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import 'semantic-ui-css/semantic.min.css'

import './index.css'

import configureStore from './store/'
import App from './App'

import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
	<Provider store={configureStore()}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>, 
	document.getElementById('root')
)

registerServiceWorker()
