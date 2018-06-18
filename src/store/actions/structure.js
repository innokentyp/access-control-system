import { denormalize, schema, omit } from 'normalizr'

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

export function patch(id, data) {
	return (dispatch, getState) => {
		const { structure: { roots, places: prevPlaces, at } } = getState()

		return new Promise(
			(resolve, reject) => {
				try { 
					const places = { ...prevPlaces }

					places[id] = { ...places[id], ...data }

					{
						const place = new schema.Entity('places', {}, 
				      {
				        processStrategy: (value, parent, key) => {
				        
				          return omit(value, 'parent')
				        }
				      }
				    )
				    place.define({ places: [ place ] })

				    const denormalizedData = denormalize({ places: roots }, { places: [ place ] }, { places: places })

				    console.dir(denormalizedData)
			  	}

					resolve({ roots: [ ...roots ], places, at })
				} catch (e) {

					reject(e)
				}
		  }				
		)
		.then(
			response => {				
				dispatch(placesFetched(response.roots, response.places, response.at))
			}
		)	
	}
}