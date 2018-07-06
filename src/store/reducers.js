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
    roots: [], // Список корневых помещений
    places: {},
    at: 0,
    
    inserted: [],
    updated: [],
    deleted: []
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
      return { ...state, roots: action.roots, places: action.places, at: action.at, inserted: [], updated: [], deleted: [] }
    case types.ADD_PLACE: {
      const places = { ...state.places } 
      places[action.place.id] = action.place

      if (action.place.parent) {
        const parent = action.place.parent
        parent.places ? parent.places.push(action.place.id) : (parent.places = [action.place.id])        

        if (state.updated.includes(action.rootId) || state.inserted.includes(action.rootId))
          return { ...state, places }
        else        
          return { ...state, places, updated: [ ...state.updated, action.rootId ] }
      } else {
        return { ...state, roots: [ ...state.roots, action.rootId ], places, inserted: [ ...state.inserted, action.rootId ] }
      }      
    }  
    case types.UPDATE_PLACE: {
      const places = { ...state.places } 
      places[action.id] = { ...places[action.id], ...action.data }      

      if (state.updated.includes(action.rootId) || state.inserted.includes(action.rootId))
        return { ...state, places }
      else        
        return { ...state, places, updated: [ ...state.updated, action.rootId ] }
    }
    case types.DELETE_PLACE: {
      const places = { ...state.places }
      
      function deletePlace(id) {
        const place = places[id]

        if (place) {
          if (place.places) {
            place.places.forEach(item => { deletePlace(item) })

            delete place.places
          }

          delete places[id]
        }
      }

      deletePlace(action.place.id)
      
      if (action.place.parent) {
        const parent = action.place.parent
        
        if (parent.places) {
          const index = parent.places.indexOf(action.place.id)
          if (index >= 0) {
            parent.places.splice(index, 1)

            parent.places.length === 0 && delete parent.places
          }
        } 

        if (state.updated.includes(action.rootId) || state.inserted.includes(action.rootId))
          return { ...state, places }
        else        
          return { ...state, places, updated: [ ...state.updated, action.rootId ] }
      } else {
        const roots = [ ...state.roots ]

        let index = roots.indexOf(action.rootId)
        index >= 0 && roots.splice(index, 1)

        const updated = [ ...state.updated ]

        index = updated.indexOf(action.rootId)
        index >= 0 && updated.splice(index, 1)

        if (state.inserted.includes(action.rootId)) {
          const inserted = [ ...state.inserted ]

          index = inserted.indexOf(action.rootId)
          index >= 0 && inserted.splice(index, 1)

          return { ...state, roots, places, updated, inserted }
        } else
          return { ...state, roots, places, updated, deleted: [ ...state.deleted, action.rootId ] }
      }
    }
    case types.CHANGE_PLACE_PARENT: {
      console.log(action.place, action.parent) 
  
      return { ...state }
    }
    case types.PLACE_PUTTED: {
      const inserted = [ ...state.inserted ]

      const index = inserted.indexOf(action.id)
      index >= 0 && inserted.splice(index, 1)

      return { ...state, inserted } 
    }
    case types.PLACE_PATCHED: {
      const updated = [ ...state.updated ]

      const index = updated.indexOf(action.id)
      index >= 0 && updated.splice(index, 1)

      return { ...state, updated } 
    }      
    case types.PLACE_DELETED: {
      const deleted = [ ...state.deleted ]

      const index = deleted.indexOf(action.id)
      index >= 0 && deleted.splice(index, 1)

      return { ...state, deleted } 
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