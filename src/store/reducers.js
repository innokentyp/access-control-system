import { combineReducers } from 'redux'

import { 
  LOGIN,

  LOGIN_SUCCEEDED, 
  LOGIN_FAILED,

  LOGOUT
} from './constants'

export const preloadedState = {
  authentication: {
    message: '',
    user: {}
  }
}

function authentication(state = preloadedState.authentication, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state, message: '' }
    case LOGIN_SUCCEEDED:
      return { ...state, message: '', user: { ...action.user } }
    case LOGIN_FAILED:
      return { ...state, message: action.message }
    case LOGOUT:
      return { ...state, user: {} }  
    default:
      return state 
  }
}

export default combineReducers({ authentication })