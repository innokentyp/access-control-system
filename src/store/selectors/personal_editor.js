import { createSelector } from 'reselect'

import { _store } from '../'
import { requestSubject } from '../actions/personal_editor'

export const getSubject = createSelector(
	[(state, id) => state.personal_editor.subjects[id], (state, id) => id],
	(subject, id) => {
		console.log(`getSubject for ${id}`)

		if (subject) 
			return { ...subject, created_at: new Date(subject.created_at), updated_at: new Date(subject.updated_at) }
		else {
			_store.dispatch(requestSubject(id))

			return {
				id,
				name: '',
  			created_at: new Date(),
  			updated_at: new Date(),
  			photos: []
			}	
		}
	} 
)

