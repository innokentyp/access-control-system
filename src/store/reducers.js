import { combineReducers } from 'redux'

import { 
  LOGIN,
  LOGIN_SUCCEEDED,
  LOGOUT,
  
  REQUEST_SUBJECTS,
  SET_SUBJECTS,

  SET_FILTERING,
  SET_SORTING,
  SET_NUMBER_PER_PAGE,
  SET_ACTIVE_PAGE
} from './constants'

export const preloadedState = {
  authentication: {
    user: {}
  },

  subjects: {
    items: [],

    filtering: '',
    sorting: '',
  
    numberPerPage: 12,
    activePage: 1
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
    case REQUEST_SUBJECTS:
      return state
    case SET_SUBJECTS:
      return { ...state, items: [ ...action.items ], activePage: 1 }

    case SET_FILTERING: 
      return { ...state, filtering: action.filtering, activePage: 1 }  
    case SET_SORTING: 
      return { ...state, sorting: action.sorting }  
    case SET_NUMBER_PER_PAGE: 
      return { ...state, numberPerPage: action.numberPerPage, activePage: 1 }  
    case SET_ACTIVE_PAGE: 
      return { ...state, activePage: action.activePage }  
  
    default:
      return state 
  }
}

export default combineReducers({ authentication, subjects })