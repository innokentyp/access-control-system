import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Grid, List } from 'semantic-ui-react'

import * as actions from '../store/actions/structure'
import * as selectors from '../store/selectors/structure'

class StructureItem extends Component {
	constructor(props) {
		super(props)

		this.selectedPath = props.selectedPath
	}

	listIconClick = place => e => {		
		const { expand } = this.props.actions

		this.selectedPath = []		
		expand(place.id, !place.expanded)		
	}	

	render() {
		const { placeId: id, places, url, selected, actions } = this.props
		const selectedPath = this.selectedPath		
		const place = places[id] || { id, name: id, maximum_control: 0 }
		const expanded = place.expanded || selectedPath.includes(id)
		
		return (
			<List.Item key={id}>
				<List.Icon name={`${expanded  ? 'down' : 'right'} triangle`} style={{ cursor: 'pointer', visibility: place.places ? 'visible' : 'hidden' }} onClick={this.listIconClick(place)} />						
				<List.Content>
					{
						id === selected
						?
						place.name
						:
						<Link to={`${url}/${id}`}>{ place.name }</Link>
					}	        
	        {
	        	(place.places && expanded)
	        	&& 
		        <List.List>
							{
								place.places.map(
									(item, i) => <StructureItem key={item} placeId={item} places={places} url={url} selected={selected} selectedPath={selectedPath} actions={actions} />
								)
							}
						</List.List>
					}				
	      </List.Content>
			</List.Item>
		)
	}
}

class Structure extends Component {
	render() {
		const { match, location, actions, structure: { roots, places } } = this.props
		
		var selected = ''
		var selectedPath = []
		
		{
			const match = location.pathname.match(new RegExp('structure/(\\w+)$'))
		
			if (match && match[1]) {
				selected = match[1]
				selectedPath = places[selected] ? selectors.placePath(places[selected], 'id') : [selected]
				
				window.sessionStorage.setItem('places-selected-id', selected)
			} else 
				window.sessionStorage.removeItem('places-selected-id')
		}
		
		return (
			<Container as="section">
				<h3>{this.constructor.name} match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>	

				<Grid>
					<Grid.Row>
						<Grid.Column width={6}>
							<List>
								{
									roots.map(
										(item, i) => <StructureItem key={item} placeId={item} places={places} url={match.url} selected={selected} selectedPath={selectedPath} actions={actions} />
									)
								}
							</List>
						</Grid.Column>
						<Grid.Column width={10}>
							<Route path={`${match.url}/:id`} render={
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
			structure: selectors.getStructure(state)
		}
	), 
	dispatch => (
		{ 
			actions: bindActionCreators(actions, dispatch)		
		}
	)
) (Structure)