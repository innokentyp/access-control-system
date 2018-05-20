import { createStore, applyMiddleware } from 'redux'

import thunkMiddleware from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'

import { createLogger } from 'redux-logger'

import reducer, { preloadedState } from './reducers'
import requestSubjectsSaga from './sagas/requestSubjectsSaga'

export default function configureStore() {
	// create the saga middleware
	const sagaMiddleware = createSagaMiddleware()

	const store = createStore(reducer, preloadedState, applyMiddleware(thunkMiddleware, sagaMiddleware, createLogger()))  

	// then run the saga
	sagaMiddleware.run(requestSubjectsSaga)

	// return
	return store
}