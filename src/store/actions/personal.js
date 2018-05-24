import {
  SET_FILTERING,
  SET_SORTING
} from '../constants'

export function setFiltering(filtering) {
	return {
		type: SET_FILTERING,
		filtering
	}
}

export function setSorting(sorting) {
	return {
		type: SET_SORTING,
		sorting
	}
}