import { createSelector } from 'reselect'

import { _store } from '../'
import { requestPlaces } from '../actions/structure'
/*
export function placePath(place, path = []) {
	path.splice(0, 0, place) 

	return place.parent ? placePath(place.parent, path) : path 
}

export function placeRoot(place) {
	return place.parent ? placeRoot(place.parent) : place
}
*/
export function placePath(places, place) {
	for (const item of places) {
		if (item.id === place.id) {

			return [ item ]
		} else {
			if (item.places) {
				const path = placePath(item.places, place)

				if (path.length) return [ item, ...path ]
			}
		}
	}

	return []
}

export function placeRoot(places, place) {
	const path = placePath(places, place)

	return path.length ? path[0] : place
}

export const getStructure = createSelector(
	state => state.structure,
	structure => {
		structure.at > 0 || _store.dispatch(requestPlaces())
		
		return structure
	}	
)

export function getPlaceById(places, id) {
	for (const place of places) {
		if (place.id === id) {

			return place
		} else {
			if (place.places) {
				const child = getPlaceById(place.places, id)

				if (child) return child
			}
		}
	}
	
	return null
}  

export function getChildren(places, id) {
	const place = getPlaceById(places, id)

	return (place && place.places) ? place.places : [] 
}

export const getPlace = createSelector(
	[ (state, id) => state.structure, (state, id) => id ],
	(structure, id) => {
		structure.at > 0 || _store.dispatch(requestPlaces())

		return getPlaceById(structure.places, id) || { id, name: id, maximum_control: 0 }		
	}	
)

