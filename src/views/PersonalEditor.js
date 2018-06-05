import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Breadcrumb, Segment, Form, Button, Icon } from 'semantic-ui-react'
import axios from 'axios'

import * as actions from '../store/actions/personal_editor'
import { getSubject } from '../store/selectors/personal_editor'

class PersonalEditor extends Component {
	constructor(props) {
		super(props)

		const { subject } = props

		this.state = {
			name: subject.name,
			photo: (subject.photos && subject.photos.length) ? subject.photos[0] : null,
			updated: false
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		console.log('UNSAFE_componentWillReceiveProps')

		const { subject } = nextProps

		this.setState( 
			{
				name: subject.name,
				photo: (subject.photos && subject.photos.length) ? subject.photos[0] : null
			}
		)
	}

	allClick = (e) => {
		
	}

	formSubjectSubmit = (e) => {
		e.preventDefault()
		
    const data = { 
			name: this.state.name,
			photos: this.state.photo ? [ this.state.photo ] : [] 
		}

		axios.patch(
			`http://localhost:8000/subjects/${this.props.match.params.id}`,
			data,
			{
      	headers: {
      		'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.jwt}`
      	}    		
			}
		).then(
			response => {
				console.log(response.data)
			}
		).catch (
		  error => {
		  	console.log(error.message)				    
		  }
	  )
    
	}
		
	subjectNameChange = (e) => {
		this.setState({ name: e.target.value, updated: true })
	}

	subjectPhotoChange = (e) => {
		console.log('subjectPhotoChange')

		e.preventDefault()

    const reader = new FileReader()
    
    reader.onloadend = () => {
      this.setState({ photo: reader.result, updated: true })
    }

    reader.readAsDataURL(e.target.files[0])		
	}

	clearPhoto = (e) => {
		this.inputPhoto.value = ''
		
		this.setState({ photo: null, updated: true })
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
			      	<input type="text" name="subject-name" id="form-subject-name" value={this.state.name} onChange={this.subjectNameChange} autoComplete="nope" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
			      </Form.Field>
					
						<p>{subject.name ? subject.name : subject.id}</p>
						
						<Form.Field>
							<img 
								src={this.state.photo ? this.state.photo : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII='} 
								width="200" 
								height="150" 
								style={{ borderRadius: '4px', padding: '4px', backgroundColor: 'lightsteelblue', objectFit: 'contain' }} 
								alt={subject.id}
							/>
											
							<input type="file" accept="image/*" name="photo" ref={input => this.inputPhoto = input} onChange={this.subjectPhotoChange} />
						</Form.Field>

						<Button type="button" onClick={this.clearPhoto}>Очистить</Button>

						<p>{subject.created_at.toLocaleString('ru-RU')} / {subject.updated_at.toLocaleString('ru-RU')}</p>
						<p>{subject.placeId}</p>

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
			subject: getSubject(state, props.match.params.id),
			jwt: state.authentication.user.jwt
		}
	),
	dispatch => (
		{
			actions: bindActionCreators(actions, dispatch)
		}
	)
)(PersonalEditor)