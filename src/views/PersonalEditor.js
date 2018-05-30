import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Breadcrumb, Segment, Button } from 'semantic-ui-react'

import * as actions from '../store/actions/personal_editor'
import { getSubject } from '../store/selectors/personal_editor'

class PersonalEditor extends Component {
	allClick = (e) => {
		window.sessionStorage.removeItem('subjects-selected-id')
	}

	saveClick = (e) => {

	}

	backClick = (e) => {
		this.props.history.goBack()
	}

	render() {
		console.log(`render: ${this.constructor.name}`)

		const { subject } = this.props

		return (
			<Container as="section">
				<Breadcrumb>
			    <Breadcrumb.Section link as={Link} to="/personal" onClick={this.allClick}>Список персонала</Breadcrumb.Section>
			    <Breadcrumb.Divider icon="right arrow" />
			    <Breadcrumb.Section active>{subject.name ? subject.name : subject.id}</Breadcrumb.Section>
			  </Breadcrumb>

				<h3>{this.constructor.name} match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>

				<Segment>
					<p>{subject.name ? subject.name : subject.id}</p>

					<img 
						src={(subject.photos && subject.photos.length) ? subject.photos[0].photo : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII='} 
						width="200" 
						height="150" 
						style={{ borderRadius: '4px', padding: '4px', backgroundColor: 'lightsteelblue', objectFit: 'contain' }} 
						alt={subject.id}
					/>

					<p>{subject.created_at.toLocaleString('ru-RU')} / {subject.updated_at.toLocaleString('ru-RU')}</p>

					<Button onClick={this.saveClick}>Save</Button>
				</Segment>
				
				<Button onClick={this.backClick}>Back</Button>
			</Container>
		)
	}	
}

export default connect(
	(state, props) => (
		{
			subject: getSubject(state, props.match.params.id)
		}
	),
	dispatch => (
		{
			actions: bindActionCreators(actions, dispatch)
		}
	)
)(PersonalEditor)