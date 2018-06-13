import { createSelector } from 'reselect'

import { _store } from '../'
import { requestPlaces } from '../actions/structure'

export function placePath(place, value = 'name', path = []) {
	path.splice(0, 0, place[value]) 

	return place.parent ? placePath(place.parent, value, path) : path 
}

export const getStructure = createSelector(
	state => state.structure,
	structure => {
		console.log('getStructure')

		structure.at > 0 || _store.dispatch(requestPlaces())
		
		return structure
	}	
)

export const getPlace = createSelector(
	[ (state, id) => state.structure.places[id], (state, id) => state.structure.at, (state, id) => id ],
	(place, at, id) => {
		console.log(`getPlace for ${id}`)

		if (place) {
			return { ...place }
		} else {
			at > 0 || _store.dispatch(requestPlaces())
			
			return {
				id,
      	name: id,
      	maximum_control: 0
      }
		}
	}	
)