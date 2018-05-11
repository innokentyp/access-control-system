import { createStore, applyMiddleware } from 'redux'

//import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'

import reducer, { preloadedState } from './reducers'
import loginSaga from './sagas/loginSaga'

export default function configureStore() {
	// create the saga middleware
	const sagaMiddleware = createSagaMiddleware()
	const store = createStore(reducer, preloadedState, applyMiddleware(sagaMiddleware, /*thunkMiddleware,*/createLogger()))

	// then run the saga
	sagaMiddleware.run(loginSaga)

	return store
}