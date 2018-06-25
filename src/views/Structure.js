import React, { Component, Fragment } from 'react'
import { NavLink, Route } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Grid, List, Button, Icon, Menu, Dropdown } from 'semantic-ui-react'

import * as actions from '../store/actions/structure'
import * as selectors from '../store/selectors/structure'

import PlaceEditor from '../components/PlaceEditor'
import create_uuid from '../library/uuid'

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
		const { structure: { inserted, updated }, actions: { post, patch } } = this.props

		inserted.length && post()
		updated.length && patch() 
	}

	refreshClick = (e) => {
		const { actions: { requestPlaces } } = this.props

		requestPlaces()
	}

	addClick = (parentId) => (e) => {
		const id = create_uuid()
		const name = prompt('Введите название элемента', `Элемент ${id}`)

		if (name) {
			const { structure: { places: { [parentId]: parent } } } = this.props

			if (parent) {
				const place = {
					id,
					name: name.trim(),
					maximum_control: 0,
					parent
				} 
				
				this.props.actions.addPlace(place, selectors.placeRoot(place).id)
			} else
				alert('Невозможно определить владельца элемента!')
		}
	}

	deleteClick = (id) => (e) => {
		const { structure: { places: { [id]: place } } } = this.props

		if (place) {
			if (window.confirm(`Выбросить ${place.name}?`))						
				this.props.actions.deletePlace(place, selectors.placeRoot(place).id)
		} else
			alert('Невозможно найти элемент!')
	}

	addRootClick = (e) => {
		e.preventDefault()

		const id = create_uuid()
		const name = prompt('Введите название элемента', `Элемент ${id}`)

		if (name) {
			const place = {
				id,
				name: name.trim(),
				maximum_control: 0
			} 
			
			this.props.actions.addPlace(place, id)
		}
	}

	render() {
		console.log(`render: ${this.constructor.name}`)

		const { structure: { roots, places, inserted, updated, deleted }, match, location: { pathname } } = this.props	
		const path = pathname.match(new RegExp('structure/*$')) ? pathname + '/:id' : pathname.replace(new RegExp('\\w+/*$'), ':id')
					
		return (
			<Container as="section">
				<Menu secondary size="small">
					<Route path={path} children={
						({ match }) => (
							<Dropdown item text="Меню">
		            <Dropdown.Menu>
		            	{
		            		match 
		            		&&
		            		<Fragment>
		            			<Dropdown.Item text="Новый элемент" onClick={this.addClick(match.params.id)} />
				              <Dropdown.Item text="Выбросить" onClick={this.deleteClick(match.params.id)} />
				              <Dropdown.Divider />
		            		</Fragment>
		            	}
		              <Dropdown.Item text="Новый корневой элемент" onClick={this.addRootClick} />
		            </Dropdown.Menu>
		          </Dropdown>
						)
					} />					
				</Menu>

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
								<List.Item>
									<List.Icon name="down triangle" style={{ visibility: 'hidden' }} />
									<List.Content as="a" href="/structure/add" onClick={this.addRootClick}>( Новый элемент )</List.Content>
								</List.Item>
							</List>			
						</Grid.Column>

						<Grid.Column width={10} style={{ minHeight: '215px' }}>
							<Route path={path} component={PlaceEditor} />
						</Grid.Column>
					</Grid.Row>

					<Grid.Row>
						<Grid.Column>
							<Button positive disabled={inserted.length === 0 && updated.length === 0} onClick={this.saveClick}><Icon name="check" /> Записать</Button>
							<Button onClick={this.refreshClick}><Icon name="refresh" /> Обновить</Button>
						</Grid.Column>
					</Grid.Row>

					<Grid.Row>						
						<Grid.Column width={5}>
							Inserted:
							<pre>{JSON.stringify(inserted, null, 2)}</pre>
						</Grid.Column>
						<Grid.Column width={5}>
							Updated:
							<pre>{JSON.stringify(updated, null, 2)}</pre>
						</Grid.Column>						
						<Grid.Column width={6}>
							Deleted:
							<pre>{JSON.stringify(deleted, null, 2)}</pre>
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