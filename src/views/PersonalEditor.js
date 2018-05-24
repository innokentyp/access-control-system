import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Breadcrumb, Segment, Button } from 'semantic-ui-react'

import * as actions from '../store/actions/subjects'
import { selectSubject } from '../store/selectors/personal'

class PersonalEditor extends Component {
	allClick = (e) => {
		window.sessionStorage.removeItem('subjects-selected-id')
	}

	clearClick = (e) => {
		this.props.actions.setSubjects(
			[
				{
					id: "1w18g4cif9bhebp4",
					name: "Васильева Лорна Абрикосовна",
					created_at: "01.01.2018 00:00:00",
					updated_at: "01.01.2018 00:00:00"
				}
			]
		)
	}

	render() {
		console.log(`render: ${this.constructor.name}`)

		const { subject } = this.props

		return (
			<Container as="section">
				<Breadcrumb>
			    <Breadcrumb.Section link as={Link} to="/personal" onClick={this.allClick}>Список персонала</Breadcrumb.Section>
			    <Breadcrumb.Divider icon="right arrow" />
			    <Breadcrumb.Section active>{subject.name}</Breadcrumb.Section>
			  </Breadcrumb>

				<h3>{this.constructor.name} match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>

				<Segment>
					<p>{subject.name ? subject.name : subject.id}</p>

					<img 
						src={subject.photo ? subject.photo : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII='} 
						width="200" 
						height="150" 
						style={{ borderRadius: '4px', padding: '4px', backgroundColor: 'lightsteelblue', objectFit: 'contain' }} 
						alt={subject.id}
					/>
				</Segment>

				<Button onClick={this.clearClick}>Clear</Button>
			</Container>
		)
	}	
}

export default connect(
	(state, props) => (
		{
			subject: selectSubject(state, props)
		}
	),
	dispatch => (
		{
			actions: bindActionCreators(actions, dispatch)
		}
	)
)(PersonalEditor)