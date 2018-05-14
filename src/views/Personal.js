import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Container } from 'semantic-ui-react'

import * as actions from '../store/actions/subjects'

class Personal extends Component {
	componentDidMount() {
		if (Object.keys(this.props.subjects).length === 0) {

			this.props.actions.requestSubjects()
		}
	}

	render() {
		return (
			<Container as="section">
				<h3>Personal match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>

				<ul>
					{
						Object.values(this.props.subjects).map(
							(item, i) => (
								<li key={item.id}>{item.name}</li>
							)	
						)
					}
				</ul>					
			</Container>
		)
	}
}

export default connect(
	state => (
		{ 
			subjects: state.subjects.items
		}
	), 
	dispatch => (
		{ 
			actions: bindActionCreators(actions, dispatch)
		}
	)
)(Personal) 