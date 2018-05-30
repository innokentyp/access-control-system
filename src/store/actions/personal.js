import * as types from '../constants'

export function requestSubjects(activePage = 1, numberPerPage = 16) {
	return {
		type: types.REQUEST_SUBJECTS,
		activePage,
		numberPerPage
	}
}

export function subjectsFetched(subjects, at, page, limit) {
	return {
		type: types.SUBJECTS_FETCHED,
		subjects,
		at,
		page,
		limit,
	}
}

export function setFiltering(filtering) {
	return {
		type: types.SET_FILTERING,
		filtering
	}
}

export function setSorting(sorting) {
	return {
		type: types.SET_SORTING,
		sorting
	}
}