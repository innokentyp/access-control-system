import * as types from '../constants'

export function requestSubject(id) {
	return {
		type: types.REQUEST_SUBJECT,
		id
	}
}

export function subjectFetched(subject) {
	return {
		type: types.SUBJECT_FETCHED,
		subject
	}
}