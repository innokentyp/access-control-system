import { createSelector } from 'reselect'

import { _store } from '../'
import { requestPlaces } from '../actions/structure'

export function placePath(place, value = 'name', path = []) {
	path.splice(0, 0, place[value]) 

	return place.parent ? placePath(place.parent, value, path) : path 
}

export function isParent(place, id) {
	if (place.id === id)
		return true
	else
		return place.parent ? isParent(place.parent, id) : false 
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
	[ (state, id) => state.structure, (state, id) => id ],
	(structure, id) => {
		console.log(`getPlace for ${id}`)

		structure.at > 0 || _store.dispatch(requestPlaces())

		return structure.places[id] || {
			id,
    	name: id,
    	maximum_control: 0
    }		
	}	
)
