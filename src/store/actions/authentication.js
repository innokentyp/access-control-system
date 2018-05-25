import axios from 'axios'

import { 
  LOGIN_SUCCEEDED,
  LOGOUT
} from '../constants'

export function login(credentials) { 
	return dispatch => {
		return axios.get('http://localhost:8000/users', { params: { name: credentials.name, password: credentials.password } }).then(
	  	response => {
				if (response.data.length) dispatch(loginSucceeded({ name: response.data[0].name, jwt: response.data[0].jwt }))
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