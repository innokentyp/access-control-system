import axios from 'axios'

import * as types from '../constants'

export function login(credentials) { 
	return (dispatch, getState) => {
		return axios.get('http://localhost:8000/users', { params: { name: credentials.name, password: credentials.password } }).then(
	  	response => {
				if (response.data.length) { 
					window.sessionStorage.setItem('jwt', response.data[0].jwt)

					dispatch(loggedIn({ name: response.data[0].name, jwt: response.data[0].jwt })) 
				}
		  }
	  )	
	}  	  			  
}

export function logout() {
	return (dispatch, getState) => {
		window.sessionStorage.removeItem('jwt')	

		dispatch(loggedOut())
	}
}	

export function loggedIn(user) {
	return {
		type: types.LOGGED_IN,
		user
	}
}

export function loggedOut() {
	return {
		type: types.LOGGED_OUT
	}
}