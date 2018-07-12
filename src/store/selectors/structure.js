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

export function getPlaceById(id, places = _store.getState().structure.places) {
	for (const item of places) {
		if (item.id === id) return item 
		
		if (item.places) {
			const child = getPlaceById(id, item.places)

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
	[ (structure, id) => structure, (structure, id) => id ],
	(structure, id) => {
		structure.at > 0 || _store.dispatch(requestPlaces())

		return getPlaceById(id, structure.places) || { id, name: id, maximum_control: 0 }		
	}	
)

