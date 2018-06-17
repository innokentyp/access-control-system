import React, { Component } from 'react'
import { NavLink, Route } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Grid, List } from 'semantic-ui-react'

import * as actions from '../store/actions/structure'
import * as selectors from '../store/selectors/structure'

class _ListOfPlaces extends Component {
	render() {
		const { location: { pathname }, match: { url, params: { id: parentId } }, structure: { places } } = this.props
		
		return (
			<List.List>
				{
					places[parentId].places.map(
						(id, i) => {
							const place = places[id] || { id, name: id }	
							const expanded = pathname.includes(id) && place.places	

							return (
								<List.Item key={id}>
									<List.Icon name={`${expanded  ? 'down' : 'right'} triangle`} style={{ visibility: place.places ? 'visible' : 'hidden' }} />						
									<List.Content>
										<NavLink to={`${url}/${id}`} activeStyle={{ color: 'orange' }}>{ place.name }</NavLink>
						        {
						        	expanded
						        	&&
						        	<Route path={`${url}/:id`} component={ListOfPlaces} />
						        }	
						      </List.Content>
								</List.Item>
							)
						}
					)
				}				
			</List.List>
		)
	}
}

const ListOfPlaces = connect(
	(state, props) => (
		{ 
			structure: selectors.getStructure(state)			
		}
	)
) (_ListOfPlaces)

class Structure extends Component {
	state = {}
	
	static getDerivedStateFromProps(props, state) {
		const { pathname } = props.location		
		
		window.sessionStorage.setItem('places-selected-path', pathname)
		
		return state
	}	

	render() {
		console.log(`render: ${this.constructor.name}`)

		const { structure: { roots, places }, match, location } = this.props	
		const path = location.pathname.match(new RegExp('structure/*$')) ? location.pathname + '/:id' : location.pathname.replace(new RegExp('\\w+/*$'), ':id')
					
		return (
			<Container as="section">
				<h3>{this.constructor.name} match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>	

				<Grid>
					<Grid.Row>
						<Grid.Column width={6}>
							<Route path={match.url} render={
								props => {
									return (
										<List>
											{
												roots.map(
													(id, i) => {
														const expanded = true

														const place = places[id] || { id, name: id }

														return (
															<List.Item key={id}>
																<List.Icon name={`${expanded  ? 'down' : 'right'} triangle`} style={{ cursor: 'pointer', visibility: place.places ? 'visible' : 'hidden' }} />						
																<List.Content>
																	<NavLink to={`${match.url}/${id}`} activeStyle={{ color: 'orange' }}>{ place.name }</NavLink>
													        {
													        	place.places
													        	&&
													        	<Route path={`${match.url}/:id`} component={ListOfPlaces} />
													        }	
													      </List.Content>
															</List.Item>
														)
													}
												)
											}
										</List>
									)
								}
							} />
						</Grid.Column>
						<Grid.Column width={10}>
							<Route path={path} render={
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