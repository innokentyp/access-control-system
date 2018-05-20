import {
	REQUEST_SUBJECTS,
  SET_SUBJECTS,
  SET_FILTERING,
  SET_SORTING,
  SET_NUMBER_PER_PAGE,
  SET_ACTIVE_PAGE
} from '../constants'

export function requestSubjects() {
	return {
		type: REQUEST_SUBJECTS
	}
}

export function setSubjects(items) {
	return {
		type: SET_SUBJECTS,
		items
	}
}

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

export function setNumberPerPage(numberPerPage) {
	return {
		type: SET_NUMBER_PER_PAGE,
		numberPerPage
	}
}

export function setActivePage(activePage) {
	return {
		type: SET_ACTIVE_PAGE,
		activePage
	}
}