import { 
  LOGGED_IN, 
  LOGGED_OUT
} from './constants'

export function loggedIn(user) {
	return {
		type: LOGGED_IN,
		user
	}
}

export function loggedOut() {
	return {
		type: LOGGED_OUT
	}
}