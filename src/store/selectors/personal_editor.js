import { createSelector } from 'reselect'

import { requestSubject } from '../actions/personal_editor'
import { getPlace } from './structure'

export const getSubject = createSelector(
	[ (state, id, dispatch) => state.structure, (state, id, dispatch) => state.personal_editor.subjects[id], (state, id, dispatch) => id, (state, id, dispatch) => dispatch ],
	(structure, subject, id, dispatch) => {
		if (subject) {
			return { 
				id,
				name: subject.name, 
				created_at: new Date(subject.created_at), 
				updated_at: new Date(subject.updated_at),
				place: getPlace(structure, subject.placeId, dispatch), 
				photos: (subject.photos && subject.photos.length) ? [ ...subject.photos ] : []
			}
		} 
		
		dispatch(requestSubject(id))

		return {
			id,
			name: '',
			created_at: new Date(),
			updated_at: new Date(),
			place: { id: '', name: '(Нет)' },
			photos: []
		}			
	} 
)

