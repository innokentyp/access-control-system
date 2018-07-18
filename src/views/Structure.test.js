import React, { Component } from 'react'
import { Provider } from 'react-redux'

import { MemoryRouter, Route } from 'react-router-dom'
import { withRouter } from 'react-router'

import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import toJson from 'enzyme-to-json'

import configureMockStore from 'redux-mock-store'

import ConnectedStructure, { Structure } from './Structure'
import { preloadedState } from '../store/reducers'

const middlewares = []
const mockStore = configureMockStore(middlewares)

configure({ adapter: new Adapter() })

global.sessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
}

const history = {
	replace: jest.fn(),
	push: jest.fn()
}

const places = [
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

const actions = {
	requestPlaces: jest.fn(),
	addPlace: jest.fn(),
	deletePlace: jest.fn(),
	changePlaceParent: jest.fn(),
	post: jest.fn(), 
	patch: jest.fn(), 
	remove: jest.fn()
}
/*
jest.mock('../store/', 
	() => (
		{
			_store: {
				getState: jest.fn().mockImplementation(
					() => { 
						return {
							structure: {
								places: global.places
							}
						} 
					}	
				)
			}
		}
	)
)
*/
describe('Structure', 
	() => {
		it('renders without crashing',
			() => {
				const props = {
					match: {
						url: '/structure'
					},
					location: { 
						pathname: '/structure'
					},
					history,
					structure: {
				    places,
				    at: new Date(2018, 1, 1).getTime(),    
				    inserted: [], updated: [], deleted: []
				  },
				  actions 
				}

				const wrapper = shallow(<Structure {...props} />)

				expect(toJson(wrapper)).toMatchSnapshot()
			}
		)
		
		it('correct render for deep place',
			() => {
				const state = {
					...JSON.parse(JSON.stringify(preloadedState)),
					structure: {
				    places,
				    at: new Date(2018, 1, 1).getTime(),    
				    inserted: [], updated: [], deleted: []
				  }
				}

				const place = {
					id: '1w18g4bzwzi6rwmj',
					name: 'Этаж 1' 
				}

				const wrapper = mount(
					<Provider store={mockStore(state)}>
						<MemoryRouter initialEntries={[ `/structure/1w18g4bzsoe2f6ue/${place.id}` ]}>
							<Route path='/structure' render={props => <ConnectedStructure {...props} />} />													
						</MemoryRouter>
					</Provider>	
				)

				expect(wrapper.find(`PlaceItem[name="${place.name}"]`)).toHaveLength(1)
				expect(wrapper.find(`PlaceEditor input[name="place-name"][value="${place.name}"]`)).toHaveLength(1)
			}
		)
		
	}
)