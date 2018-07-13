import { call, put, select, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

import * as types from '../constants'
import { placesFetched } from '../actions/structure'

export function getJWT(state) {
  return state.authentication.user.jwt
}

export function* fetchPlaces(action) {
  try {
    const response = yield call(
    	axios.get, 
    	'http://localhost:8000/places', 
    	{ 
        params: { },
    		headers: { 'Authorization': `Bearer ${yield select(getJWT)}` } 
    	}
    )

    yield put(placesFetched(response.data, Date.now()))
  } catch (e) {   
    console.log(e.message) 
  }
}

export default function* requestPlacesSaga() {
  yield takeLatest(types.REQUEST_PLACES, fetchPlaces)
}