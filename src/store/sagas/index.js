import { all } from 'redux-saga/effects'

import requestSubjectsSaga from './requestSubjectsSaga'
import requestSubjectPhotoSaga from './requestSubjectPhotoSaga'

export default function* rootSaga() {
  yield all(
	  [
	    requestSubjectsSaga(),
	    requestSubjectPhotoSaga()
	  ]
  )
}