import axios from 'axios'
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

export function patch(id, data) {
	return (dispatch, getState) => {
		return axios
			.patch(
				`http://localhost:8000/subjects/${id}`,
				data,
				{
	      	headers: {
	      		'Content-Type': 'application/json',
	          'Authorization': `Bearer ${getState().authentication.user.jwt}`
	      	}    		
				}
			)
			.then(
				response => {				
					dispatch(subjectFetched(response.data))
				}
			)	
	}
}