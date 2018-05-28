import { createSelector } from 'reselect'

export const getSubject = createSelector(
	(state, props) => state.personal_editor.subject,
	subject => {
		console.log('getSubject')

		return subject
	} 
)

