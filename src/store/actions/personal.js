import * as types from '../constants'

export function requestSubjects() {
	return {
		type: types.REQUEST_SUBJECTS
	}
}

export function subjectsFetched(subjects) {
	return {
		type: types.SUBJECTS_FETCHED,
		subjects
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