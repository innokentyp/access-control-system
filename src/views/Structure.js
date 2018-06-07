import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container } from 'semantic-ui-react'

import * as actions from '../store/actions/structure'
import * as selectors from '../store/selectors/structure'

class Structure extends Component {
	render() {
		const { places } = this.props

		return (
			<Container as="section">
				<h3>{this.constructor.name} match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>	
				
				<ul>
					{
						places.map(
							(item, i) => (
								<li key={item}>{item}</li>
							)
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
			places: selectors.getPlaces(state)				
		}
	), 
	dispatch => (
		{ 
			actions: bindActionCreators(actions, dispatch)		
		}
	)
) (Structure)