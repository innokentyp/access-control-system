import { createSelector } from 'reselect'

export const selectAllSubjects = createSelector(
	[ state => state.subjects.items, state => state.subjects.sorting ],
	(subjects, sorting) => {
		var items = subjects.map((item, i) => ({ ...item, created_at: new Date(item.created_at), updated_at: new Date(item.updated_at) }))

		if (sorting) {
			items.sort(
				(a, b) => {
					switch (sorting) {
						case 'id':
							return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0)
						case 'name': 
							let [ x, y ] = [ a.name.toLowerCase(), b.name.toLowerCase() ]
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

		return items
	}
)

export const selectTotalPages = createSelector(
	[ state => state.subjects.items.length, state => state.subjects.numberPerPage ],
	(count, numberPerPage) => Math.ceil(count / numberPerPage)	
)

export const selectActivePageSubjects = createSelector(
	[ selectAllSubjects, state => ({ numberPerPage: state.subjects.numberPerPage, activePage: state.subjects.activePage }) ],
	(subjects, { numberPerPage, activePage }) => {
		const start = (activePage - 1) * numberPerPage

		return subjects.slice(start, start + numberPerPage)
	}
) 