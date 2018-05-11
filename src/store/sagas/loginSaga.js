import { call, put, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

import { LOGIN, LOGIN_SUCCEEDED, LOGIN_FAILED } from '../constants'

function* login(action) {
  try {
    const response = yield call(axios.get, `/data/users/${action.credentials.name}-${action.credentials.password}.json`)

    yield put({ type: LOGIN_SUCCEEDED, user: { name: action.credentials.name, ...response.data } })
  } catch (e) {
    yield put({ type: LOGIN_FAILED, message: e.message })
  }
}

function* loginSaga() {
  yield takeLatest(LOGIN, login)
}

export default loginSaga