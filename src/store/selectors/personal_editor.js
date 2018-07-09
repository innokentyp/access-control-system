import { createSelector } from 'reselect'

import { _store } from '../'
import { requestSubject } from '../actions/personal_editor'
import { getStructure, getPlaceById } from './structure'

export const getSubject = createSelector(
	[ (state, id) => getStructure(state).places, (state, id) => state.personal_editor.subjects[id], (state, id) => id ],
	(places, subject, id) => {
		console.log(`getSubject for ${id}`)

		const emptyPlace = {
			id: '',
			name: '(Нет)'
		}

		if (subject) {
			return { 
				id,
				name: subject.name, 
				created_at: new Date(subject.created_at), 
				updated_at: new Date(subject.updated_at),
				place: getPlaceById(places, subject.placeId) || emptyPlace,
				photos: (subject.photos && subject.photos.length) ? [ ...subject.photos ] : []
			}
		} else {
			_store.dispatch(requestSubject(id))

			return {
				id,
				name: '',
  			created_at: new Date(),
  			updated_at: new Date(),
  			place: emptyPlace,
  			photos: []
			}	
		}
	} 
)

