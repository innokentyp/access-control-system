import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, List } from 'semantic-ui-react'

import * as actions from '../store/actions/structure'
import * as selectors from '../store/selectors/structure'

class StructureItem extends Component {
	listIconClick = place => e => {		
		const { expand } = this.props.actions
		
		expand(place.id, !place.expanded)		
	}

	placeClick = e => {
		window.sessionStorage.setItem('places-selected-id', this.props.placeId)
	}

	render() {
		const { placeId: id, places, url, selected } = this.props		
		const place = places[id] || { id, name: id, maximum_control: 0 }
		
		return (
			<List.Item key={id}>
				{
					place.places
					?
					<Fragment>
						<List.Icon name={`${place.expanded ? 'down' : 'right'} triangle`} style={{ cursor: 'pointer' }} onClick={this.listIconClick(place)} 
						/>						
						<List.Content>
			        <Link to={`${url}/${id}`} style={{ fontWeight: id === selected ? 'bolder' : 'normal' }} onClick={this.placeClick}>{ place.name }</Link>
			        {
			        	place.expanded
			        	&& 
				        <List.List>
									{
										place.places.map(
											(item, i) => <StructureItem key={item} placeId={item} places={places} url={url} selected={selected} actions={this.props.actions} />
										)
									}
								</List.List>
							}				
			      </List.Content>
					</Fragment>
					:
					<Link to={`${url}/${id}`} style={{ marginLeft: '16px', fontWeight: id === selected ? 'bolder' : 'normal' }} onClick={this.placeClick}>{ place.name }</Link>
				}			
			</List.Item>
		)
	}
}

class Structure extends Component {
	render() {
		const { roots, places } = this.props.structure
		const { match, location } = this.props

		var selected = ''
		{
			const match = location.pathname.match(new RegExp('structure/(\\w+)$'))
	
			if (match && match[1]) selected = match[1]
		} 

		return (
			<Container as="section">
				<h3>{this.constructor.name} match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>	

				<List>
					{
						roots.map(
							(item, i) => <StructureItem key={item} placeId={item} places={places} url={match.url} selected={selected} actions={this.props.actions} />
						)
					}
				</List>
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