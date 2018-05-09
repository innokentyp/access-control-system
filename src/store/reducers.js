import { combineReducers } from 'redux'

import { 
  LOGGED_IN, 
  LOGGED_OUT
} from './constants'

export const preloadedState = {
  authentication: {
    is: false,
    user: {}
  }
}

function authentication(state = preloadedState.authentication, action) {
  switch (action.type) {
    case LOGGED_IN:
      return { ...state, is: true, user: { ...action.user, logged: new Date() } }
    case LOGGED_OUT:
      return { ...state, is: false, user: {} }  
    default:
      return state 
  }
}

export default combineReducers({ authentication })