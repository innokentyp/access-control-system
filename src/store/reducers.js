import { combineReducers } from 'redux'

import { 
  LOGIN,
  LOGIN_SUCCEEDED,
  LOGOUT,

  SET_SORTING,
  REQUEST_SUBJECTS,
  SET_SUBJECTS
} from './constants'

export const preloadedState = {
  authentication: {
    user: {}
  },

  subjects: {
    sorting: 'name',
    items: []
  } 
}

function authentication(state = preloadedState.authentication, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state }
    case LOGIN_SUCCEEDED:
      window.sessionStorage.setItem('jwt', action.user.jwt)

      return { ...state, user: { ...action.user } }
    case LOGOUT:
      window.sessionStorage.removeItem('jwt')

      return { ...state, user: {} }  
    default:
      return state 
  }
}

function subjects(state = preloadedState.subjects, action) {
  switch (action.type) {
    case SET_SORTING: 
      return { ...state, sorting: action.sorting }
    case REQUEST_SUBJECTS:
      return { ...state, items: [] }
    case SET_SUBJECTS:
      return { ...state, items: [ ...action.items ] }
    default:
      return state 
  }
}

export default combineReducers({ authentication, subjects })