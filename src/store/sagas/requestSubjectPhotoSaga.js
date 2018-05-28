import { call, put, select, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

import * as types from '../constants'

function* fetchSubjectPhoto(action) {
  try {
    const response = yield call(
    	axios.get, 
    	'http://localhost:8000/photos', 
    	{ 
    		params: { subjectId: action.id }, 
    		headers: { 'Authorization': `Bearer ${yield select((state) => state.authentication.user.jwt)}` } 
    	}
    )
    
    yield put({ type: types.SET_SUBJECT_PHOTO, id: action.id, photo: response.data.length ? response.data[0].photo : '' })    
  } catch (e) {   
    console.log(e.message) 
  }
}

function* requestSubjectPhotoSaga() {
  yield takeLatest(types.REQUEST_SUBJECT_PHOTO, fetchSubjectPhoto)
}

export default requestSubjectPhotoSaga