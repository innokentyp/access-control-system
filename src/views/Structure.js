import React, { Component } from 'react'
import { NavLink, Route } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Grid, List, Button, Icon } from 'semantic-ui-react'
import { denormalize, schema } from 'normalizr'

import * as actions from '../store/actions/structure'
import * as selectors from '../store/selectors/structure'

import PlaceEditor from '../components/PlaceEditor'

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
	state = { data: {} }
	
	static getDerivedStateFromProps(props, state) {
		const { pathname } = props.location		
		
		window.sessionStorage.setItem('places-selected-path', pathname)
		
		return null
	}	

	saveClick = (e) => {
		const { actions: { patch } } = this.props
		
		patch() 
	}

	refreshClick = (e) => {
		const { actions: { requestPlaces } } = this.props

		requestPlaces()
	}

	testClick = (e, { root: id }) => {
		const places = {} 

		Object.values(this.props.structure.places).forEach(
			place => {
				places[place.id] = { ...place }

				delete places[place.id].parent
			}
		)		

		const place_schema = new schema.Entity('places', {})
		place_schema.define({ places: [ place_schema ] })

		const data = denormalize({ places: [ id ] }, { places: [ place_schema ] }, { places })

		this.setState({ data })

		console.log(this.props.structure.places)
	}

	render() {
		console.log(`render: ${this.constructor.name}`)

		const { structure: { roots, places, updated }, match, location: { pathname } } = this.props	
		const path = pathname.match(new RegExp('structure/*$')) ? pathname + '/:id' : pathname.replace(new RegExp('\\w+/*$'), ':id')
					
		return (
			<Container as="section">
				<h3>{this.constructor.name} match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>	

				<Grid>
					<Grid.Row>
						<Grid.Column width={6}>							
							<List>
								{
									roots.map(
										(id, i) => {
											const place = places[id] || { id, name: id }
											const expanded = pathname.includes(id) && place.places

											return (
												<List.Item key={id}>
													<List.Icon name={`${expanded  ? 'down' : 'right'} triangle`} style={{ visibility: place.places ? 'visible' : 'hidden' }} />						
													<List.Content>
														<NavLink to={`${match.url}/${id}`} activeStyle={{ color: 'orange' }}>{ place.name }</NavLink>
										        {
										        	expanded
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
						</Grid.Column>
						<Grid.Column width={10}>
							<Route path={path} component={PlaceEditor} />
						</Grid.Column>
					</Grid.Row>

					<Grid.Row>
						<Grid.Column>
							<Button positive disabled={updated.length === 0} onClick={this.saveClick}><Icon name="check" /> Записать</Button>
							<Button onClick={this.refreshClick}><Icon name="refresh" /> Обновить</Button>
							<pre>{JSON.stringify(updated, null, 2)}</pre>
						</Grid.Column>
					</Grid.Row>

					<Grid.Row>
						<Grid.Column>
							<Button root="1w18g4bzsoe2f6ue" onClick={this.testClick}>Test</Button>							
							<pre>{JSON.stringify(this.state.data, null, 2)}</pre>
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