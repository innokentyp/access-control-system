import * as types from '../constants'

export function requestSubjects(query = { _page: 1, _limit: 16 }) {
	return {
		type: types.REQUEST_SUBJECTS,
		query
	}
}

export function subjectsFetched(query, subjects, at) {
	return {
		type: types.SUBJECTS_FETCHED,
		query,
		subjects,
		at
	}
}