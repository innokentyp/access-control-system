import { all } from 'redux-saga/effects'

import requestSubjectsSaga from './requestSubjectsSaga'

export default function* rootSaga() {
  yield all(
	  [
	    requestSubjectsSaga()
	  ]
  )
}