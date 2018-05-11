import { 
	LOGIN,

  LOGIN_SUCCEEDED, 
  LOGIN_FAILED,

  LOGOUT
} from './constants'

export function login(credentials) {
	return {
		type: LOGIN,
		credentials
	}
}

export function loginSucceeded(user) {
	return {
		type: LOGIN_SUCCEEDED,
		user
	}
}

export function loginFailed(message) {
	return {
		type: LOGIN_FAILED,
		message
	}
}

export function logout() {
	return {
		type: LOGOUT
	}
}