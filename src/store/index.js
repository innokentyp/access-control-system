import { createStore, applyMiddleware } from 'redux'

import thunkMiddleware from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'

import { createLogger } from 'redux-logger'
import decode from 'jwt-decode'

import reducer, { preloadedState } from './reducers'
import requestSubjectsSaga from './sagas/requestSubjectsSaga'
import { loginSucceeded } from './actions/authentication'

export default function configureStore() {
	// create the saga middleware
	const sagaMiddleware = createSagaMiddleware()

	const store = createStore(reducer, preloadedState, applyMiddleware(thunkMiddleware, sagaMiddleware, createLogger()))  

	// then run the saga
	sagaMiddleware.run(requestSubjectsSaga)

	// login
	var jwt = window.sessionStorage.getItem('jwt')

	if (jwt) {
	  store.dispatch(loginSucceeded({ name: decode(jwt).name, jwt }))
	}

	// return
	return store
}