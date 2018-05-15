import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Container } from 'semantic-ui-react'

import * as actions from '../store/actions/subjects'
import { selectAllSubjects } from '../store/selectors/subjects'

class Personal extends Component {
	componentDidMount() {
		if (this.props.subjects.length === 0) {

			this.props.actions.requestSubjects()
		}
	}

	render() {
		return (
			<Container as="section">
				<h3>Personal match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>

				<ul>
					{
						this.props.subjects.map(
							(item, i) => (
								<li key={item.id}>{item.name} / id: {item.id} / создан: {item.created_at.toLocaleString('ru-RU')} / изменен: {item.updated_at.toLocaleString('ru-RU')}</li>
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
			subjects: selectAllSubjects(state)
		}
	), 
	dispatch => (
		{ 
			actions: bindActionCreators(actions, dispatch)
		}
	)
)(Personal) 