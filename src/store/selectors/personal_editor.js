import { createSelector } from 'reselect'

import { _store } from '../'
import { requestSubject } from '../actions/personal_editor'
import { getPlace } from './structure'

export const getSubject = createSelector(
	[(state, id) => state, (state, id) => state.personal_editor.subjects[id], (state, id) => id],
	(state, subject, id) => {
		console.log(`getSubject for ${id}`)

		if (subject) {
			const place = getPlace(state, subject.placeId)

			return { 
				id,
				name: subject.name, 
				created_at: new Date(subject.created_at), 
				updated_at: new Date(subject.updated_at),
				place,
				photos: (subject.photos && subject.photos.length) ? [ ...subject.photos ] : []
			}
		} else {
			_store.dispatch(requestSubject(id))

			return {
				id,
				name: '',
  			created_at: new Date(),
  			updated_at: new Date(),
  			place: {
  				id: '',
  				name: '(Нет)'
  			},
  			photos: []
			}	
		}
	} 
)

