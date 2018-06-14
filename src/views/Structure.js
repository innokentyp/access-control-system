import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Grid, List } from 'semantic-ui-react'

import * as actions from '../store/actions/structure'
import * as selectors from '../store/selectors/structure'

class _StructureItem extends Component {
	constructor(props) {
		super(props)

		this.isParent = selectors.isParent(props.selected, props.placeId)
	}

	listIconClick = place => e => {		
		const { actions: { expand } } = this.props

		this.isParent = false		

		expand(place.id, !place.expanded)		
	}	

	render() {
		const { placeId: id, structure: { places }, selected } = this.props

		const place = places[id] || {
			id,
    	name: id,
    	maximum_control: 0
    }
				
		const expanded = place.expanded || this.isParent
		
		return (
			<List.Item key={id}>
				<List.Icon name={`${expanded  ? 'down' : 'right'} triangle`} style={{ cursor: 'pointer', visibility: place.places ? 'visible' : 'hidden' }} onClick={this.listIconClick(place)} />						
				<List.Content>
					{
						id === selected.id
						?
						place.name
						:
						<Link to={`/structure/${id}`}>{ place.name }</Link>
					}	        
	        {
	        	(place.places && expanded)
	        	&& 
		        <List.List>
							{
								place.places.map(
									(item, i) => <StructureItem key={item} placeId={item} selected={selected} />
								)
							}
						</List.List>
					}				
	      </List.Content>
			</List.Item>
		)
	}
}

const StructureItem = connect(
	(state, props) => (
		{ 
			structure: selectors.getStructure(state)			
		}
	), 
	dispatch => (
		{ 
			actions: {
				expand: (id, value) => { dispatch(actions.expand(id, value)) }
			}
		}
	)
) (_StructureItem)

class Structure extends Component {
	state = {}
	
	static getDerivedStateFromProps(props, state) {
		const { id: selected } = props.match.params

		selected
		?
		window.sessionStorage.setItem('places-selected-id', selected)
		: 
		window.sessionStorage.removeItem('places-selected-id')

		return state
	}

	render() {
		console.log(`render: ${this.constructor.name}`)

		const { structure: { roots, places }, selected } = this.props
				
		return (
			<Container as="section">
				<h3>{this.constructor.name} match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>	

				<Grid>
					<Grid.Row>
						<Grid.Column width={6}>
							<List>
								{
									roots.map(
										(item, i) => <StructureItem key={item} placeId={item} selected={selected} />
									)
								}
							</List>
						</Grid.Column>
						<Grid.Column width={10}>
							<Route path="/structure/:id" render={
								props => { 
									const { id } = props.match.params
									const place = places[id]

									if (place) {
										return (
											<pre>{JSON.stringify(place, null, 2)}</pre>
										) 
									} else
										return <p>( <code>{id}</code> - место не найдено )</p>
								}
							} />
						</Grid.Column>
					</Grid.Row>
				</Grid>				
			</Container>
		)
	}	
}

export default connect(
	(state, props) => (
		{ 
			structure: selectors.getStructure(state),
			selected: selectors.getPlace(state, props.match.params.id)
		}
	), 
	dispatch => (
		{ 
			actions: bindActionCreators(actions, dispatch)		
		}
	)
) (Structure)