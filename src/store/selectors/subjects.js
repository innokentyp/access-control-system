import { createSelector } from 'reselect'

export const selectAllSubjects = createSelector(
	state => state.subjects.items,
	subjects => {
		console.log('selectAllSubjects')

		return subjects.map(item => ({ ...item, created_at: new Date(item.created_at), updated_at: new Date(item.updated_at) }))
	}
)

export const selectFilteringSubjects = createSelector(
	[ selectAllSubjects, state => state.subjects.filtering ],
	(subjects, filtering) => {
		console.log('selectFilteringSubjects')

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

export const selectSortingSubjects = createSelector(
	[ selectFilteringSubjects, state => state.subjects.sorting ],
	(subjects, sorting) => {
		console.log('selectSortingSubjects')
		
		if (sorting) {
			let items = subjects

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

			return items
		}

		return subjects
	}	
)