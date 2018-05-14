import { call, put, select, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

import { REQUEST_SUBJECTS, SET_SUBJECTS } from '../constants'

function* fetchSubjects(action) {
  try {
    const response = yield call(
    	axios.get, 
    	'/data/subjects.json', 
    	{ 
    		params: { items: 'all' }, 
    		headers: { 'Authorization': `Bearer ${yield select((state) => state.authentication.user.jwt)}` } 
    	}
    )

    yield put({ type: SET_SUBJECTS, items: response.data })
  } catch (e) {    
    console.error(e.message)
  }
}

function* requestSubjectsSaga() {
  yield takeLatest(REQUEST_SUBJECTS, fetchSubjects)
}

export default requestSubjectsSaga