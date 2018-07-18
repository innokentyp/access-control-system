import { createSelector } from 'reselect'

import { requestSubjects } from '../actions/personal'

export function getQuery(state) {
	return state.personal.query
}

export const getSubjects = createSelector(
	[ (state, dispatch) => state.personal.subjects, (state, dispatch) => state.personal.at, (state, dispatch) => dispatch ],
	(subjects, at, dispatch) => {
		console.log('getSubjects')

		at > 0 || dispatch(requestSubjects())
		
		return subjects.map(item => ({ ...item, created_at: new Date(item.created_at), updated_at: new Date(item.updated_at) }))
	}	
)

/*
export const getSubjectsWithFiltering = createSelector(
	[ getSubjects, state => state.personal.filtering ],
	(subjects, filtering) => {
		console.log('getSubjectsWithFiltering')

		if (filtering) {
			try {
				let r = new RegExp(filtering)

				return subjects.filter(item => r.test(item.name))
			} catch (e) {
				console.log(e.message)
			}
		}

		return subjects
	}
)

export const getSubjectsWithFilteringAndSorting = createSelector(
	[ getSubjectsWithFiltering, state => state.personal.sorting ],
	(subjects, sorting) => {
		console.log('getSubjectsWithFilteringAndSorting')
		
		if (sorting) {
			return [...subjects].sort(
				(a, b) => {
					switch (sorting) {
						case 'id':
							return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0)
						case 'name': 
							let [ x, y ] = [ a.name ? a.name.toLowerCase() : 'яяя', b.name ? b.name.toLowerCase() : 'яяя' ]
							return x < y ? -1 : (x > y ? 1 : 0)
						case 'created_at':
							return a.created_at.getTime() - b.created_at.getTime()
						case 'updated_at':
							return a.updated_at.getTime() - b.updated_at.getTime()
						default:
							return -1	
					}
				}
			)
		}

		return subjects
	}	
)
*/