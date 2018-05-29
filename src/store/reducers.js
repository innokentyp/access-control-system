import { combineReducers } from 'redux'

import * as types from './constants'

// constants
personal_editor.MAX_SUBJECTS = 12

// preloaded state
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
    subjects: {}
  } 
}

// reducers
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
      const subjects = { ...state.subjects, [action.subject.id]: action.subject }
      const ids = Object.keys(subjects)

      while (ids.length > personal_editor.MAX_SUBJECTS) {
        delete subjects[ids[0]]
        ids.splice(0, 1)
      }

      return { ...state, subjects }    
    default:
      return state 
  }
}

export default combineReducers({ authentication, personal, personal_editor })