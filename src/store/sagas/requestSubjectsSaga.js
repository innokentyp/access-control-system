import { call, put, select, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

import { REQUEST_SUBJECTS, SET_SUBJECTS, FETCH_SUBJECTS_FAILED } from '../constants'

function* fetchSubjects(action) {
  try {
    const response = yield call(
    	axios.get, 
    	'http://localhost:8000/subjects', 
    	{ 
    		params: { }, 
    		headers: { 'Authorization': `Bearer ${yield select((state) => state.authentication.user.jwt)}` } 
    	}
    )

    yield put({ type: SET_SUBJECTS, items: response.data })
  } catch (e) {   
    yield put({ type: FETCH_SUBJECTS_FAILED, error: e }) 
  }
}

function* requestSubjectsSaga() {
  yield takeLatest(REQUEST_SUBJECTS, fetchSubjects)
}

export default requestSubjectsSaga