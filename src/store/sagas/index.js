import { all } from 'redux-saga/effects'

import requestPlacesSaga from './requestPlacesSaga'
import requestSubjectsSaga from './requestSubjectsSaga'
import requestSubjectSaga from './requestSubjectSaga'

export default function* rootSaga() {
  yield all(
	  [
	  	requestPlacesSaga(),
	    requestSubjectsSaga(),
	    requestSubjectSaga()
	  ]
  )
}