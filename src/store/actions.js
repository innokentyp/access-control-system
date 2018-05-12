import { 
	LOGIN,

  LOGIN_SUCCEEDED, 
  LOGIN_FAILED,
  LOGIN_RESET,

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

export function loginFailed(error) {
	return {
		type: LOGIN_FAILED,
		error
	}
}

export function loginReset() {
	return {
		type: LOGIN_RESET
	}
}

export function logout() {
	return {
		type: LOGOUT
	}
}