import { denormalize, schema } from 'normalizr'

import * as types from '../constants'

export function requestPlaces() {
	return {
		type: types.REQUEST_PLACES
	}
}

export function placesFetched(roots, places, at) {
	return {
		type: types.PLACES_FETCHED,
		roots,
		places,
		at
	}
}

export function updatePlace(id, data, rootId) {
	return {
		type: types.UPDATE_PLACE,
		id,
		data,
		rootId
	}
}

export function placePatched(id) {
	return {
		type: types.PLACE_PATCHED,
		id
	}
}

export function patch(id) {
	return (dispatch, getState) => {
		const { structure: { places: { [id]: place } } } = getState()

		return new Promise(
			(resolve, reject) => {
				try {
					const place_schema = new schema.Entity('places')
			    place_schema.define({ places: [ place_schema ] })

			    const denormalizedData = denormalize({ places: [ id ] }, { places: [ place_schema ] }, { places: { [id]: place } })

			    console.dir(denormalizedData)			  	

					resolve(id)
				} catch (e) {

					reject(e)
				}
		  }				
		)
		.then(
			id => {				
				dispatch(placePatched(id))
			}
		)	
	}
}