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

export function expand(id, value = true) {
	return {
		type: types.PLACE_EXPAND,
		id,
		value
	}
}