import { combineReducers } from 'redux'

import * as types from './constants'
import * as selectors from './selectors/structure'

// constants
personal_editor._maxSubjects = 12

// preloaded state
export const preloadedState = {
  authentication: {
    user: {}
  },

  structure: {
    roots: [], // Список корневых помещений
    //places: {},

    places: [],
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
      return { ...state, places: action.places, at: action.at, inserted: [], updated: [], deleted: [] }
    case types.ADD_PLACE: 
    {
      const places = JSON.parse(JSON.stringify(state.places))

      if (action.parent) {
        const parent = selectors.getPlaceById(action.parent.id, places)

        if (parent) {
          parent.places ? parent.places.push(action.place) : (parent.places = [action.place])

          const path = selectors.placePath(parent, places)

          if (path.length) {
            const rootId = path[0].id

            if (state.updated.includes(rootId) || state.inserted.includes(rootId))
              return { ...state, places }
            else        
              return { ...state, places, updated: [ ...state.updated, rootId ] }
          }
        }
      } else {
        places.push(action.place)

        return { ...state, places, inserted: [ ...state.inserted, action.place.id ] }
      }

      return state
    }  
    case types.UPDATE_PLACE: 
    {
      const places = JSON.parse(JSON.stringify(state.places))
      const place = selectors.getPlaceById(action.place.id, places)

      if (place) {
        Object.assign(place, action.data)  

        const path = selectors.placePath(place, places)

        if (path.length) {
          const rootId = path[0].id

          if (state.updated.includes(rootId) || state.inserted.includes(rootId))
            return { ...state, places }
          else        
            return { ...state, places, updated: [ ...state.updated, rootId ] }
        }
      }

      return state  
    }
    case types.DELETE_PLACE: {
      const places = JSON.parse(JSON.stringify(state.places))
      const path = selectors.placePath(action.place, places)

      if (path.length) {      
        if (path.length > 1) {
          const parent = path[path.length - 2]
          
          if (parent.places) {
            const index = parent.places.findIndex(item => item.id === action.place.id)

            if (index >= 0) {
              parent.places.splice(index, 1)

              parent.places.length === 0 && delete parent.places
            }
          } 

          const rootId = path[0].id  

          if (state.updated.includes(rootId) || state.inserted.includes(rootId))
            return { ...state, places }
          else        
            return { ...state, places, updated: [ ...state.updated, rootId ] }
        } else {
          let index = places.findIndex(item => item.id === action.place.id)
          index >= 0 && places.splice(index, 1)

          const updated = [ ...state.updated ]

          index = updated.indexOf(action.place.id)
          index >= 0 && updated.splice(index, 1)

          if (state.inserted.includes(action.place.id)) {
            const inserted = [ ...state.inserted ]

            index = inserted.indexOf(action.place.id)
            index >= 0 && inserted.splice(index, 1)

            return { ...state, places, updated, inserted }
          } else
            return { ...state, places, updated, deleted: [ ...state.deleted, action.place.id ] }
        }
      }

      return state
    }
    case types.CHANGE_PLACE_PARENT:
    {
      const places = JSON.parse(JSON.stringify(state.places))

      const updated = [ ...state.updated ]
      const deleted = [ ...state.deleted ]
      const inserted = [ ...state.inserted ]
     
      const path = selectors.placePath(action.place, places)

      if (path.length) {
        if (path.length > 1) {
          const parent = path[path.length - 2]

          if (parent.places) {
            const index = parent.places.findIndex(item => item.id === action.place.id)

            if (index >= 0) {
              parent.places.splice(index, 1)

              parent.places.length || delete parent.places
            }
          }

          const rootId = path[0].id  
          updated.includes(rootId) || inserted.includes(rootId) || updated.push(rootId)
        } else {
          let index = places.findIndex(item => item.id === action.place.id)
          index >= 0 && places.splice(index, 1)

          index = updated.indexOf(action.place.id)
          index >= 0 && updated.splice(index, 1)

          index = inserted.indexOf(action.place.id)
          if (index >= 0) 
            inserted.splice(index, 1)
          else
            deleted.includes(action.place.id) || deleted.push(action.place.id)
        }

        const place = path[path.length - 1]

        if (action.parent) {
          const newPath = selectors.placePath(action.parent, places)

          if (newPath.length) {
            const parent = newPath[newPath.length - 1]

            parent.places ? parent.places.push(place) : (parent.places = [place])
        
            const rootId = newPath[0].id  
            updated.includes(rootId) || inserted.includes(rootId) || updated.push(rootId)

            return { ...state, places, updated, deleted, inserted }
          }
        } else {
          places.push(place)

          const index = updated.indexOf(place.id)
          index >= 0 && updated.splice(index, 1)

          inserted.includes(place.id) || inserted.push(place.id)

          return { ...state, places, updated, deleted, inserted }
        }
      }

      return state
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