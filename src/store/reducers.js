import { combineReducers } from 'redux'

import * as types from './constants'

// constants
personal_editor._maxSubjects = 12

// preloaded state
export const preloadedState = {
  authentication: {
    user: {}
  },

  structure: {
    roots: [],
    places: {},
    at: 0,

    // Список корневых помещений
    updated: []
  },

  personal: {
    query: {
      _page: 1,
      _limit: 16 
    },  

    subjects: [],
    at: 0
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

function structure(state = preloadedState.structure, action) {
  switch (action.type) {    
    case types.PLACES_FETCHED:
      return { ...state, roots: action.roots, places: action.places, at: action.at, updated: [] }
    case types.UPDATE_PLACE: {
      const places = { ...state.places } 
      places[action.id] = { ...places[action.id], ...action.data }

      const updated = [ ...state.updated ]
      updated.includes(action.rootId) || updated.push(action.rootId)

      return { ...state, places, updated } 
    }
    case types.PLACE_PATCHED: {
      const updated = [ ...state.updated ]

      const index = updated.indexOf(action.id)
      index >= 0 && updated.splice(index, 1)

      return { ...state, updated } 
    }             
    default:
      return state 
  }
}

function personal(state = preloadedState.personal, action) {
  switch (action.type) {    
    case types.SUBJECTS_FETCHED:
      return { ...state, query: action.query, subjects: action.subjects, at: action.at }
    default:
      return state 
  }
}

function personal_editor(state = preloadedState.personal_editor, action) {
  switch (action.type) {    
    case types.SUBJECT_FETCHED:
      const subjects = { ...state.subjects, [action.subject.id]: action.subject }
      const ids = Object.keys(subjects)

      while (ids.length > personal_editor._maxSubjects) {
        delete subjects[ids[0]]
        ids.splice(0, 1)
      }

      return { ...state, subjects }    
    default:
      return state 
  }
}

export default combineReducers({ authentication, structure, personal, personal_editor })