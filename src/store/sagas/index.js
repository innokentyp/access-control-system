import { all } from 'redux-saga/effects'

import requestSubjectsSaga from './requestSubjectsSaga'
import requestSubjectSaga from './requestSubjectSaga'

export default function* rootSaga() {
  yield all(
	  [
	    requestSubjectsSaga(),
	    requestSubjectSaga()
	  ]
  )
}