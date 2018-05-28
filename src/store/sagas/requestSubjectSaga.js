import { call, put, select, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

import * as types from '../constants'

function* fetchSubject(action) {
  try {
    const response = yield call(
    	axios.get, 
    	`http://localhost:8000/subjects/${action.id}`, 
    	{ 
        params: { _embed: 'photos' },    		
    		headers: { 'Authorization': `Bearer ${yield select((state) => state.authentication.user.jwt)}` } 
    	}
    )
    
    yield put({ type: types.SUBJECT_FETCHED, subject: response.data })    
  } catch (e) {   
    console.log(e.message) 
  }
}

function* requestSubjectSaga() {
  yield takeLatest(types.REQUEST_SUBJECT, fetchSubject)
}

export default requestSubjectSaga