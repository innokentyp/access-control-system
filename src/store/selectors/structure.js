import { createSelector } from 'reselect'

import { requestPlaces } from '../actions/structure'

/* Функции */

export function placePath(place, places) {
	for (const item of places) {
		if (item.id === place.id) return [ item ]

		if (item.places) {
			const path = placePath(place, item.places)

			if (path.length) return [ item, ...path ]
		}
	}

	return []
}

export function getPlaceById(id, places) {
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
	[ (state, dispatch) => state.structure, (state, dispatch) => dispatch ],
	(structure, dispatch) => {
		structure.at > 0 || dispatch(requestPlaces())
		
		return structure
	}	
)

export const getPlace = createSelector(
	[ (structure, id, dispatch) => structure.at, (structure, id, dispatch) => structure.places, (structure, id, dispatch) => id, (structure, id, dispatch) => dispatch ],
	(at, places, id, dispatch) => {
		at > 0 || dispatch(requestPlaces())

		return getPlaceById(id, places) || { id, name: id, maximum_control: 0 }		
	}	
)

