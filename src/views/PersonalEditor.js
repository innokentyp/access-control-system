import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Breadcrumb, Segment, Form, Button, Icon } from 'semantic-ui-react'

import * as actions from '../store/actions/personal_editor'
import { getSubject } from '../store/selectors/personal_editor'

class PersonalEditor extends Component {
	state = {
		updated: false
	}

	allClick = (e) => {
		
	}

	formSubjectSubmit = (e) => {
		e.preventDefault()

		console.log(e.target['subject-name'].value)
	}
		
	subjectNameChange = (e) => {
		this.setState({ updated: true })
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
					<Form name="form-subject" onSubmit={this.formSubjectSubmit} autoComplete="off">
						<Form.Field>
			      	<label htmlFor="form-subject-name">Название:</label>
			      	<input type="text" name="subject-name" id="form-subject-name" defaultValue={subject.name} onChange={this.subjectNameChange} autoComplete="nope" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
			      </Form.Field>
					
						<p>{subject.name ? subject.name : subject.id}</p>

						<img 
							src={(subject.photos && subject.photos.length) ? subject.photos[0] : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII='} 
							width="200" 
							height="150" 
							style={{ borderRadius: '4px', padding: '4px', backgroundColor: 'lightsteelblue', objectFit: 'contain' }} 
							alt={subject.id}
						/>

						<p>{subject.created_at.toLocaleString('ru-RU')} / {subject.updated_at.toLocaleString('ru-RU')}</p>

						<Button type="submit" positive disabled={!this.state.updated}><Icon name="checkmark" /> Записать</Button>
					</Form>
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