import { call, put, select, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

import * as types from '../constants'

function* fetchSubjects(action) {
  try {
    // http://localhost:8000/subjects?name_like=45&_sort=name&_page=1&_limit=6

    const response = yield call(
    	axios.get, 
    	'http://localhost:8000/subjects', 
    	{ 
        params: { _page: action.activePage, _limit: action.numberPerPage },
    		headers: { 'Authorization': `Bearer ${yield select((state) => state.authentication.user.jwt)}` } 
    	}
    )

    yield put({ type: types.SUBJECTS_FETCHED, subjects: response.data, at: Date.now(), page: action.activePage, limit: action.numberPerPage })
  } catch (e) {   
    console.log(e.message) 
  }
}

function* requestSubjectsSaga() {
  yield takeLatest(types.REQUEST_SUBJECTS, fetchSubjects)
}

export default requestSubjectsSaga