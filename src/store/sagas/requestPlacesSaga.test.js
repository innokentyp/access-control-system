import { call, put, select } from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'

import axios from 'axios'
import { getJWT, fetchPlaces } from './requestPlacesSaga'

import * as types from '../constants'
import { placesFetched } from '../actions/structure'

describe('fetchPlaces Saga', 
	() => {
		const gen = cloneableGenerator(fetchPlaces)()

		it('must select getJWT', 
			() => {
				expect(gen.next().value).toEqual(select(getJWT))				
			}
		)

	  it('must call axios.get', 
	  	() => {
	  		const fakeJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidXNlciIsInBhc3N3b3JkIjoiMTIzNDU2In0.F1kpu314aOcXQjugsxi8XZzV4dWqE7qyOMcxzJN7zTI'

		    expect(gen.next(fakeJWT).value).toEqual(
		    	call(
			    	axios.get, 
			    	'http://localhost:8000/places', 
			    	{ 
			        params: { },
			    		headers: { 'Authorization': `Bearer ${fakeJWT}` } 
			    	}
			    )
		    )
		  }
	  )
		
		it('must put placesFetched',
			() => {
				const fakeResponse = { 
					data: [
						{
					    id: '1w18g4bzr5qhv36l',
					    name: 'Внешняя территория',
					    maximum_control: 0
					  },
					  {
					    id: '1w18g4bzsoe2f6ue',
					    name: 'Офис',
					    maximum_control: 0,
					    places: [
								{
									id: '1w18g4bzwzi6rwmj',
					        name: 'Этаж 1',
					        maximum_control: 0
								},
								{
									id: '1w18g4bzzjrjqed2',
					        name: 'Этаж 2',
					        maximum_control: 0
								}
					    ]
					  }
					] 
				}
				
				expect(gen.next(fakeResponse).value).toEqual(
					put(placesFetched(fakeResponse.data, Date.now()))
				)
			}
		)

		it('must be done',
			() => {
				expect(gen.next().done).toBeTruthy()
			}
		)

	}
)