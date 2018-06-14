import { createStore, applyMiddleware } from 'redux'

import thunkMiddleware from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'

//import { createLogger } from 'redux-logger'

import reducer, { preloadedState } from './reducers'
import rootSaga from './sagas/'

export default function configureStore() {
	// create the saga middleware
	const sagaMiddleware = createSagaMiddleware()

	_store = createStore(reducer, preloadedState, applyMiddleware(thunkMiddleware, sagaMiddleware/*, createLogger()*/))  

	// then run the saga
	sagaMiddleware.run(rootSaga)

	return _store
}

export var _store = null