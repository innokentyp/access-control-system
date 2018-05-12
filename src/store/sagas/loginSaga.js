import { call, put, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import axios from 'axios'

import { LOGIN, LOGIN_SUCCEEDED, LOGIN_FAILED } from '../constants'

function* login(action) {
	yield call(delay, 2000)

  try {
    const response = yield call(axios.get, `/data/users/${action.credentials.name}-${action.credentials.password}.json`)

    yield put({ type: LOGIN_SUCCEEDED, user: { name: action.credentials.name, ...response.data } })
  } catch (e) {
    yield put({ type: LOGIN_FAILED, error: { message: e.message } })
  }
}

function* loginSaga() {
  yield takeLatest(LOGIN, login)
}

export default loginSaga