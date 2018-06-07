import { createSelector } from 'reselect'

import { _store } from '../'
import { requestPlaces } from '../actions/structure'

export const getPlaces = createSelector(
	[ (state, id) => id ? state.structure.places[id].places : state.structure.roots, (state, id) => state.structure.at ],
	(places, at) => {
		console.log('getPlaces')

		at > 0 || _store.dispatch(requestPlaces())
		
		return places
	}	
)

export const getPlace = createSelector(
	[ (state, id) => state.structure.places[id], (state, id) => id ],
	(place, id) => {
		console.log(`getPlace for ${id}`)

		if (place) {
			return { ...place }
		} else {
			_store.dispatch(requestPlaces())
			
			return {
				id,
      	name: '',
      	maximum_control: 0
      }
		}
	}	
)