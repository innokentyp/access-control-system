import { call, put, select, takeLatest } from 'redux-saga/effects'
import axios from 'axios'
import { normalize, schema } from 'normalizr'

import * as types from '../constants'
import { placesFetched } from '../actions/structure'

export function getJWT(state) {
  return state.authentication.user.jwt
}

export function getNormalizedData(data) {
  const place = new schema.Entity('places', {}, 
    {
      processStrategy: (value, parent, key) => {
        if (parent.id) value.parent = parent          

        return value
      }
    }
  )
  place.define({ places: [ place ] })

  return normalize(data, [ place ])
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

    //const normalizedData = yield call(getNormalizedData, response.data)

    //yield put(placesFetched(normalizedData.result, normalizedData.entities.places, Date.now()))

    yield put(placesFetched(response.data, Date.now()))
  } catch (e) {   
    console.log(e.message) 
  }
}

export default function* requestPlacesSaga() {
  yield takeLatest(types.REQUEST_PLACES, fetchPlaces)
}