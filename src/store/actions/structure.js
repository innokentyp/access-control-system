import { denormalize, schema } from 'normalizr'
import axios from 'axios'

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

export function patch() {
	return (dispatch, getState) => {
		const { structure: { updated } } = getState()
		const places = {} 

		Object.values(getState().structure.places).forEach(
			place => {
				places[place.id] = { ...place }

				delete places[place.id].parent
			}
		)			

		const place_schema = new schema.Entity('places')
		place_schema.define({ places: [ place_schema ] })

		const data = denormalize({ places: updated }, { places: [ place_schema ] }, { places })

		//console.dir(data)

		return Promise.all(
			data.places.map(
				place => {
					return axios
						.patch(
							`http://localhost:8000/places/${place.id}`,
							place,
							{
				      	headers: {
				      		'Content-Type': 'application/json',
				          'Authorization': `Bearer ${getState().authentication.user.jwt}`
				      	}    		
							}
						)						
						.catch(e => e)	

					/*
					return new Promise(
						(resolve, reject) => {
							try {							  	
								// axios

								resolve(place.id)
							} catch (e) {

								reject(e)
							}
					  }				
					).catch(e => { return e })
					*/
				}
			)
		).then(
			values => {
				values.forEach(value => { value instanceof Error ? console.log(value.message) : dispatch(placePatched(value.data.id)) })
			}
		)	
	}
}