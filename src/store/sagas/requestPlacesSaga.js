import { call, put, select, takeLatest } from 'redux-saga/effects'
import axios from 'axios'
import { normalize, schema } from 'normalizr'

import * as types from '../constants'

function* fetchPlaces(action) {
  try {
    const response = yield call(
    	axios.get, 
    	'http://localhost:8000/places', 
    	{ 
        params: { },
    		headers: { 'Authorization': `Bearer ${yield select((state) => state.authentication.user.jwt)}` } 
    	}
    )

    const place = new schema.Entity('places', {}, 
      {
        processStrategy: (value, parent, key) => {
          if (parent.id) value.parent = parent          

          return value
        }
      }
    )
    place.define({ places: [ place ] })

    const normalizedData = normalize(response.data, [ place ])

    yield put({ type: types.PLACES_FETCHED, roots: normalizedData.result, places: normalizedData.entities.places, at: Date.now() })
  } catch (e) {   
    console.log(e.message) 
  }
}

function* requestPlacesSaga() {
  yield takeLatest(types.REQUEST_PLACES, fetchPlaces)
}

export default requestPlacesSaga