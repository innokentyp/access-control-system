import axios from 'axios'

import { 
  LOGIN_SUCCEEDED,
  LOGOUT
} from '../constants'

export function login(credentials) { 
	return dispatch => {
		return axios.get(`/login/${credentials.name}-${credentials.password}.json`)
			.then (
		  	response => {
					dispatch(loginSucceeded({ name: credentials.name, ...response.data }))
			  }
		  )	
	}  	  			  
}

export function loginSucceeded(user) {
	return {
		type: LOGIN_SUCCEEDED,
		user
	}
}

export function logout() {
	return {
		type: LOGOUT
	}
}