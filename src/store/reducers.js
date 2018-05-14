import { combineReducers } from 'redux'

import { 
  LOGIN,
  LOGIN_SUCCEEDED,
  LOGOUT,

  REQUEST_SUBJECTS,
  SET_SUBJECTS
} from './constants'

export const preloadedState = {
  authentication: {
    user: {}
  },

  subjects: {
    sort: 'name',
    items: {}
  } 
}

function authentication(state = preloadedState.authentication, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state }
    case LOGIN_SUCCEEDED:
      return { ...state, user: { ...action.user } }
    case LOGOUT:
      return { ...state, user: {} }  
    default:
      return state 
  }
}

function subjects(state = preloadedState.subjects, action) {
  switch (action.type) {
    case REQUEST_SUBJECTS:
      return { ...state, items: {} }
    case SET_SUBJECTS:
      return { ...state, items: { ...action.items } }
    default:
      return state 
  }
}

export default combineReducers({ authentication, subjects })