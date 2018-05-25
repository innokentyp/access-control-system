import {
	REQUEST_SUBJECTS,
  SET_SUBJECTS,
  REQUEST_SUBJECT_PHOTO, 
  SET_SUBJECT_PHOTO
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

export function requestSubjectPhoto(id) {
	return {
		type: REQUEST_SUBJECT_PHOTO,
		id
	}
}

export function setSubjectPhoto(id, photo) {
	return {
		type: SET_SUBJECT_PHOTO,
		id, 
		photo
	}
}