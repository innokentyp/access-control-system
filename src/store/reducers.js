import { combineReducers } from 'redux'

import * as types from './constants'

export const preloadedState = {
  authentication: {
    user: {}
  },

  personal: {
    subjects: [],

    filtering: '',
    sorting: ''
  },

  personal_editor: {
    subject: {}
  } 
}

function authentication(state = preloadedState.authentication, action) {
  switch (action.type) {
    case types.LOGGED_IN:
      return { ...state, user: { ...action.user } }
    case types.LOGGED_OUT:
      return { ...state, user: {} }  
    default:
      return state 
  }
}

function personal(state = preloadedState.personal, action) {
  switch (action.type) {    
    case types.SUBJECTS_FETCHED:
      return { ...state, subjects: action.subjects }

    case types.SET_FILTERING: 
      return { ...state, filtering: action.filtering }  
    case types.SET_SORTING: 
      return { ...state, sorting: action.sorting }  
    default:
      return state 
  }
}

function personal_editor(state = preloadedState.personal_editor, action) {
  switch (action.type) {    
    case types.SUBJECT_FETCHED:
      return { ...state, subject: action.subject }
    
    default:
      return state 
  }
}

export default combineReducers({ authentication, personal, personal_editor })