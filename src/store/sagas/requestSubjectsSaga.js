import { call, put, select, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

import * as types from '../constants'

function* fetchSubjects(action) {
  try {
    const response = yield call(
    	axios.get, 
    	'http://localhost:8000/subjects', 
    	{ 
        params: { ...action.query },
    		headers: { 'Authorization': `Bearer ${yield select((state) => state.authentication.user.jwt)}` } 
    	}
    )

    yield put({ type: types.SUBJECTS_FETCHED, query: action.query, subjects: response.data, at: Date.now() })
  } catch (e) {   
    console.log(e.message) 
  }
}

function* requestSubjectsSaga() {
  yield takeLatest(types.REQUEST_SUBJECTS, fetchSubjects)
}

export default requestSubjectsSaga