import axios from 'axios'

import * as types from '../constants'
import * as selectors from '../selectors/structure'

export function requestPlaces() {
	return {
		type: types.REQUEST_PLACES
	}
}

export function placesFetched(places, at) {
	return {
		type: types.PLACES_FETCHED,
		places,
		at
	}
}

export function addPlace(place, parent) {
	return {
		type: types.ADD_PLACE,
		place,
		parent
	}
}

export function updatePlace(place, data) {
	return {
		type: types.UPDATE_PLACE,
		place,
		data
	}
}

export function deletePlace(place) {
	return {
		type: types.DELETE_PLACE,
		place
	}
}

export function changePlaceParent(place, parent) {
	return {
		type: types.CHANGE_PLACE_PARENT,
		place,
		parent
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

export function placeDeleted(id) {
	return {
		type: types.PLACE_DELETED,
		id
	}
}

export function post() {
	return (dispatch, getState) => {
		const { structure: { places, inserted } } = getState()
		
		return Promise.all(
			inserted.map(
				id => {
					const place = selectors.getPlaceById(id, places)

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
		const { structure: { places, updated } } = getState()

		return Promise.all(
			updated.map(
				id => {
					const place = selectors.getPlaceById(id, places)

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

export function remove() {
	return (dispatch, getState) => {
		const { structure: { deleted } } = getState()

		return Promise.all(
			deleted.map(
				id => {
					return axios
						.delete(
							`http://localhost:8000/places/${id}`,							
							{
				      	headers: {
				      		'Content-Type': 'application/json',
				          'Authorization': `Bearer ${getState().authentication.user.jwt}`
				      	}    		
							}
						)
						.then(response => id)
						.catch(e => e)
				}
			)
		).then(
			values => {				
				values.forEach(value => { value instanceof Error ? console.log(value.message) : dispatch(placeDeleted(value)) })
			}
		)	
	}
}