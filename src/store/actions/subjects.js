import {
	REQUEST_SUBJECTS,
  SET_SUBJECTS
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