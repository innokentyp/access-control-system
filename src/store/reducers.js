import { combineReducers } from 'redux'

import { 
  LOGIN,
  LOGIN_SUCCEEDED,
  LOGOUT,
  
  REQUEST_SUBJECTS,
  SET_SUBJECTS,
  FETCH_SUBJECTS_FAILED,

  SET_FILTERING,
  SET_SORTING
} from './constants'

export const preloadedState = {
  authentication: {
    user: {}
  },

  subjects: {
    items: [],
    error: null
  },  

  personal: {
    filtering: '',
    sorting: ''
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
      return { ...state, error: null }
    case SET_SUBJECTS:
      return { ...state, items: action.items.map(item => ({ ...item, created_at: new Date(item.created_at), updated_at: new Date(item.updated_at) })) }
    case FETCH_SUBJECTS_FAILED:
      return { ...state, error: action.error }
    default:
      return state 
  }
}

function personal(state = preloadedState.personal, action) {
  switch (action.type) {    
    case SET_FILTERING: 
      return { ...state, filtering: action.filtering }  
    case SET_SORTING: 
      return { ...state, sorting: action.sorting }  
    default:
      return state 
  }
}

export default combineReducers({ authentication, subjects, personal })