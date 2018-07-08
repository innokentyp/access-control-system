import React, { Component, Fragment } from 'react'
import { NavLink, Route } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Grid, List, Button, Icon, Menu, Dropdown, Popup, Header } from 'semantic-ui-react'

import * as actions from '../store/actions/structure'
import * as selectors from '../store/selectors/structure'

import PlaceEditor from '../components/PlaceEditor'
import create_uuid from '../library/uuid'

class PlaceItem extends Component {
	state = { isOpen: false }

	timeout = null	

	removeTimeout() {
		if (this.timeout) {
			clearTimeout(this.timeout)

			this.timeout = null
		}
	}

	popupOpen = (e) => {
		this.removeTimeout()		

		this.setState({ isOpen: true })
	}

	popupClose = (e) => {		
		this.removeTimeout()
			
		this.timeout = setTimeout(() => {
			this.timeout = null

			this.setState({ isOpen: false }) 
		}, 200)
	}

	popupMouseEnter = (e) => {
		this.removeTimeout()
	}		

	addClick = (e) => {
		e.preventDefault()

		this.props.add()

		this.setState({ isOpen: false })
	}

	deleteClick = (e) => {
		e.preventDefault()

		this.props.remove()

		this.setState({ isOpen: false })
	}

	placeDragStart = (to) => (e) => {
		this.removeTimeout()
		this.setState({ isOpen: false })

		e.dataTransfer.setData('text/plain', to)
		e.dataTransfer.dropEffect = 'move'
	} 

	placeDragOver(e) {
		e.preventDefault()

		e.dataTransfer.dropEffect = 'move'
	}

	placeDrop = (to) => (e) => {
		e.preventDefault()

		const data = e.dataTransfer.getData('text/plain')

		if (to.indexOf(data) === 0) {
			// Запрет переподчинять себе и потомкам		

			return
		}

		if (data.indexOf(to) === 0) {
			// Запрет переподчинять отцу (но не предкам)
			const re = new RegExp('\\w+', 'g')

			if (data.match(re).length === to.match(re).length + 1) {
				
				return
			}
		}

		this.props.change(data)
	}

	render() {
		const { to, name } = this.props
		const { isOpen } = this.state

		return (			
			<Popup
				trigger={<NavLink to={to} activeStyle={{ color: 'orange' }} onDragStart={this.placeDragStart(to)} onDragOver={this.placeDragOver} onDrop={this.placeDrop(to)} draggable>{ name }</NavLink>}
				content={					
					<List link>	    
				    <List.Item as="a" href={to} onClick={this.addClick}>Новый элемент</List.Item>
				    <List.Item as="a" href={to} onClick={this.deleteClick}>Выбросить</List.Item>
				  </List>
				}
				position="right center"
				horizontalOffset={4}
				hoverable
				open={isOpen}
				onOpen={this.popupOpen}
				onClose={this.popupClose}
				onMouseEnter={this.popupMouseEnter}
			/>			
		)
	}
}

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
									<List.Icon color="grey" name={`${expanded  ? 'down' : 'right'} angle`} style={{ visibility: place.places ? 'visible' : 'hidden' }} />						
									<List.Content>
										<PlaceItem to={`${url}/${id}`} name={place.name} add={Structure.add.bind(this, id)} remove={Structure.remove.bind(this, id)} change={Structure.change.bind(this, place)} />
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
	),
	dispatch => (
		{
			actions: bindActionCreators(actions, dispatch)
		}
	)
) (_ListOfPlaces)

class Structure extends Component {
	state = { }
	
	static getDerivedStateFromProps(props, state) {
		const { location: { pathname }, structure: { at } } = props	

		if (at > 0) {
			const match = pathname.match(new RegExp('\\w+', 'g'))

			if (match) {
				const length = match.length

				while (match.length > 1) {
					const { structure: { places: { [match[match.length - 1]]: place } } } = props

					if (place) break

					match.splice(match.length - 1)	
				}
				
				if (match.length < length) {
					const { history }	= props

					history.replace('/' + match.join('/'))

					return null
				} 
			}
		}

		window.sessionStorage.setItem('places-selected-path', pathname)
		
		return null
	}	
	
	saveClick = (e) => {
		const { structure: { inserted, updated, deleted }, actions: { post, patch, remove } } = this.props

		inserted.length && post()
		updated.length && patch() 
		deleted.length && remove()
	}

	refreshClick = (e) => {
		const { actions: { requestPlaces } } = this.props

		requestPlaces()
	}

	static add(parentId) {
		const id = create_uuid()
		const name = prompt('Введите название элемента', `Элемент ${id}`)

		if (name) {
			const { structure: { places: { [parentId]: parent } }, actions: { addPlace }, history } = this.props

			if (parent) {
				const place = {
					id,
					name: name.trim(),
					maximum_control: 0,
					parent
				} 
				
				addPlace(place, selectors.placeRoot(place).id)

				history.push('/structure/' + selectors.placePath(place).map(item => item.id).join('/'))
			} else
				alert('Невозможно определить владельца элемента!')
		}
	}

	addClick = (parentId) => (e) => {
		e.preventDefault() 

		Structure.add.call(this, parentId)
	}

	static remove(id) {		
		const { structure: { places: { [id]: place } }, location: { pathname }, history, actions: { deletePlace } } = this.props

		if (place) {
			if (window.confirm(`Выбросить ${place.name}?`))	{
				deletePlace(place, selectors.placeRoot(place).id)

				const index = pathname.indexOf(`/${id}`)

				if (index >= 0) {
					history.push(pathname.slice(0, index))
				}				
			}
		} else
			alert('Невозможно найти элемент!')			
	}	

	deleteClick = (id) => (e) => {
		e.preventDefault()

		Structure.remove.call(this, id)
	}

	static change(parent, newChildPath) {
		const match = newChildPath.match(new RegExp('\\w+', 'g'))
		
		const { structure: { places: { [match[match.length - 1]]: place } }, actions: { changePlaceParent } } = this.props

		changePlaceParent(place, parent)
	}

	addRootClick = (e) => {
		e.preventDefault()

		const id = create_uuid()
		const name = prompt('Введите название элемента', `Элемент ${id}`)

		if (name) {
			const { history }	= this.props

			const place = {
				id,
				name: name.trim(),
				maximum_control: 0
			} 
			
			this.props.actions.addPlace(place, id)

			history.push('/structure/' + id)
		}
	}

	addRootDragOver = (e) => {
		e.preventDefault()

		e.dataTransfer.dropEffect = 'move'
	}

	addRootDrop = (e) => {
		e.preventDefault()

		const data = e.dataTransfer.getData('text/plain')
		
		// Запрет переосить в корень корневой элемент
		const re = new RegExp('\\w+', 'g')

		if (data.match(re).length === 2) {
			
			return
		}		

		Structure.change.call(this, null, data)
	}

	render() {
		console.log(`render: ${this.constructor.name}`)		

		const { structure: { roots, places, inserted, updated, deleted }, match, location: { pathname } } = this.props	
		const path = pathname.match(new RegExp('structure/*$')) ? pathname + '/:id' : pathname.replace(new RegExp('\\w+/*$'), ':id')
		
		function trigger(match) {
			return (
				<Fragment>
					<Icon color="yellow" name="warning circle" />
					{
						match 
						?
						<span style={{ color: 'orange' }}>{places[match.params.id] ? places[match.params.id].name : match.params.id}</span> 
						:
						'( Нет )'
					}
				</Fragment>
			)
		} 					

		return (
			<Container as="section">
				<Header as="h4">Структура</Header>

				<Menu secondary>
					<Route path={path} children={
						({ match }) => (
							<Dropdown item trigger={trigger(match)}>
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

				<Grid stackable>
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
													<List.Icon color="grey" name={`${expanded  ? 'down' : 'right'} angle`} style={{ visibility: place.places ? 'visible' : 'hidden' }} />						
													<List.Content>
														<PlaceItem to={`${match.url}/${id}`} name={place.name} add={Structure.add.bind(this, id)} remove={Structure.remove.bind(this, id)} change={Structure.change.bind(this, place)} /> 
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
									<List.Content as="a" href={match.url} onClick={this.addRootClick} onDragOver={this.addRootDragOver} onDrop={this.addRootDrop}>( Новый корневой элемент )</List.Content>
								</List.Item>
							</List>									
						</Grid.Column>

						<Grid.Column width={10} style={{ minHeight: '215px' }}>
							<Route path={path} component={PlaceEditor} />
						</Grid.Column>
					</Grid.Row>

					<Grid.Row>
						<Grid.Column>
							<Button positive disabled={inserted.length === 0 && updated.length === 0 && deleted.length === 0} onClick={this.saveClick}><Icon name="check" /> Записать</Button>
							<Button negative={inserted.length > 0 || updated.length > 0 || deleted.length > 0} onClick={this.refreshClick}><Icon name="refresh" /> Обновить</Button>
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