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

export function addPlace(place, rootId) {
	return {
		type: types.ADD_PLACE,
		place,
		rootId
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

export function deletePlace(place, rootId) {
	return {
		type: types.DELETE_PLACE,
		place,
		rootId
	}
}

export function placePutted(id) {
	return {
		type: types.PLACE_PUTTED,
		id
	}
}

export function placePatched(id) {
	return {
		type: types.PLACE_PATCHED,
		id
	}
}

export function post() {
	return (dispatch, getState) => {
		const { structure: { inserted } } = getState()
		const places = {} 

		Object.values(getState().structure.places).forEach(
			place => {
				places[place.id] = { ...place }

				delete places[place.id].parent
			}
		)			

		const place_schema = new schema.Entity('places')
		place_schema.define({ places: [ place_schema ] })

		const data = denormalize({ places: inserted }, { places: [ place_schema ] }, { places })

		return Promise.all(
			data.places.map(
				place => {
					return axios
						.post(
							`http://localhost:8000/places`,
							place,
							{
				      	headers: {
				      		'Content-Type': 'application/json',
				          'Authorization': `Bearer ${getState().authentication.user.jwt}`
				      	}    		
							}
						)						
						.catch(e => e)
				}
			)
		).then(
			values => {
				values.forEach(value => { value instanceof Error ? console.log(value.message) : dispatch(placePutted(value.data.id)) })
			}
		)	
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
				}
			)
		).then(
			values => {
				values.forEach(value => { value instanceof Error ? console.log(value.message) : dispatch(placePatched(value.data.id)) })
			}
		)	
	}
}