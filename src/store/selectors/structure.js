import { createSelector } from 'reselect'

import { _store } from '../'
import { requestPlaces } from '../actions/structure'

/* Функции */

export function placePath(place, places = _store.getState().structure.places) {
	for (const item of places) {
		if (item.id === place.id) return [ item ]

		if (item.places) {
			const path = placePath(place, item.places)

			if (path.length) return [ item, ...path ]
		}
	}

	return []
}

export function getPlaceById(places, id) {
	for (const item of places) {
		if (item.id === id) return item 
		
		if (item.places) {
			const child = getPlaceById(item.places, id)

			if (child) return child
		}
	}
	
	return null
}  

/* Селекторы */

export const getStructure = createSelector(
	state => state.structure,
	structure => {
		structure.at > 0 || _store.dispatch(requestPlaces())
		
		return structure
	}	
)

export const getPlace = createSelector(
	[ (state, id) => state.structure, (state, id) => id ],
	(structure, id) => {
		structure.at > 0 || _store.dispatch(requestPlaces())

		return getPlaceById(structure.places, id) || { id, name: id, maximum_control: 0 }		
	}	
)

