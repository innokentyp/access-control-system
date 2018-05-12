import { combineReducers } from 'redux'

import { 
  LOGIN,

  LOGIN_SUCCEEDED, 
  LOGIN_FAILED,
  LOGIN_RESET,

  LOGOUT
} from './constants'

export const preloadedState = {
  authentication: {
    loading: false,
    error: {},
    user: {}
  }
}

function authentication(state = preloadedState.authentication, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state, loading: true, error: {} }
    case LOGIN_SUCCEEDED:
      return { ...state, loading: false, error: {}, user: { ...action.user } }
    case LOGIN_FAILED:
      return { ...state, loading: false, error: { ...action.error } }
    case LOGIN_RESET:
      return { ...state, error: {} }
    case LOGOUT:
      return { ...state, user: {} }  
    default:
      return state 
  }
}

export default combineReducers({ authentication })