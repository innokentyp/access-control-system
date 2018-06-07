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