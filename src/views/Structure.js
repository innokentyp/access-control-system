import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Accordion } from 'semantic-ui-react'

import * as actions from '../store/actions/structure'
import * as selectors from '../store/selectors/structure'

class Structure extends Component {
	renderItem(id) {
		const place = this.props.structure.places[id]

		return (
			place
			?
			(
				<li key={id}>{ place.name }
					{
						place.places
						&&
						<ul>
						{
							place.places.map(
								(item, i) => this.renderItem(item)
							)
						}
						</ul>
					}							
				</li>
			)
			:
			<li key={id}>{id}</li>
		)	
	}

	getPanels(places) {
		return places.map(
			(id, i) => {
				const place = this.props.structure.places[id]

				return (
					place
					?
					{
						title: place.name, 
						content: { 
							content: (
								<Fragment>
									Время повторного входа: <strong>{place.maximum_control}</strong>

									{ place.places && <Accordion.Accordion panels={this.getPanels(place.places)} /> }
								</Fragment>
							), 
							key: id 
						}
					}
					:
					{
						title: id, 
						content: {
							content: 'Place not found',
							key: id
						}	
					}
				)				 
			}
		)
	}

	render() {
		const { roots } = this.props.structure

		return (
			<Container as="section">
				<h3>{this.constructor.name} match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>	
				
				<Accordion defaultActiveIndex={0} panels={this.getPanels(roots)} styled />

				<hr />

				<ul>
					{
						roots.map(
							(item, i) => this.renderItem(item)
						)
					}
				</ul>
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