import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Breadcrumb, Segment, Form, Button, Icon, Message, List } from 'semantic-ui-react'

import * as actions from '../store/actions/personal_editor'
import { getSubject } from '../store/selectors/personal_editor'
import { placePath } from '../store/selectors/structure'

class PersonalEditor extends Component {
	constructor(props) {
		super(props)

		const { subject } = props

		this.state = {
			loading: false,
			error: null,

			name: subject.name,
			photo: subject.photos.length ? subject.photos[0] : null,
			updated: false
		}
	}
	/*
	static getDerivedStateFromProps(props, state) {
		const { name, photos } = props.subject
		const photo = photos.length ? photos[0] : null

		if (name !== state.name || photo !== state.photo) {
			const { loading, error, updated } = state

			return {
				loading,
				error,
				name,
				photo,
				updated
			}
		}
		
		return null
	}
	*/
	UNSAFE_componentWillReceiveProps(nextProps) {
		const { subject } = nextProps

		this.setState( 
			{
				loading: false, 

				name: subject.name,
				photo: subject.photos.length ? subject.photos[0] : null,
				updated: false
			}
		)
	}
	
	allClick = (e) => {
		
	}

	formSubjectSubmit = (e) => {
		e.preventDefault()

		this.setState({ loading: true, error: null })
		
    const data = { 
			name: this.state.name,
			updated_at: (new Date()).toString() 
		}

		if (this.state.photo !== (this.props.subject.photos.length ? this.props.subject.photos[0] : null)) {
			data.photos = this.state.photo ? [ this.state.photo ] : []
		}

		this.props.actions.patch(this.props.match.params.id, data)
			.catch(
			  error => {
			  	this.setState({ loading: false, error })				    
			  }
		  )    
	}

	formSubjectReset = (e) => {
		e.preventDefault()

		const { subject } = this.props

		this.setState(
			{
				error: null,

				name: subject.name,
				photo: subject.photos.length ? subject.photos[0] : null,
				updated: false
			}
		)
	}
		
	subjectNameChange = (e) => {
		this.setState({ name: e.target.value, updated: true })
	}

	subjectPhotoChange = (e) => {
		e.preventDefault()

		if (e.target.files.length < 1) return

    const reader = new FileReader()
        
    reader.onloadend = () => {
      this.setState({ photo: reader.result, updated: true })
    }		

    reader.readAsDataURL(e.target.files[0])
	}

	selectPhoto = (e) => {
		this.inputPhoto.click()
	}

	clearPhoto = (e) => {
		this.inputPhoto.value = ''
		
		this.setState({ photo: null, updated: true })
	}	

	render() {
		console.log(`render: ${this.constructor.name}`)

		const { subject } = this.props

		return (
			<Container as="section">
				<Breadcrumb>
			    <Breadcrumb.Section link as={Link} to="/personal" onClick={this.allClick}>Список персонала</Breadcrumb.Section>
			    <Breadcrumb.Divider icon="right angle" />
			    <Breadcrumb.Section active>{subject.name ? subject.name : subject.id}</Breadcrumb.Section>
			  </Breadcrumb>

				<h3>{this.constructor.name} match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>

				<Segment vertical>
					<Form name="form-subject" id="form-subject-id" loading={this.state.loading} error={!!this.state.error} onSubmit={this.formSubjectSubmit} onReset={this.formSubjectReset} autoComplete="off">
						<Form.Group inline>
							<Form.Field as="label" width={4}>ID</Form.Field>
							<Form.Field as="span" width={12}>{subject.id}</Form.Field>
						</Form.Group>

						<Form.Group inline>
			      	<Form.Field as="label" width={4} htmlFor="form-subject-name">Название</Form.Field>
			      	<Form.Field width={12}>
			      		<input type="text" name="subject-name" id="form-subject-name" value={this.state.name} onChange={this.subjectNameChange} />
			      	</Form.Field>
			      </Form.Group>	
						
						<Form.Group>
							<Form.Field width={4}><label>Фотоснимок</label></Form.Field>
							<Form.Field width={12} style={{ paddingLeft: '3px' }}>
								<img 
									src={this.state.photo ? this.state.photo : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII='} 
									width="200" 
									height="150" 
									style={{ borderRadius: '4px', padding: '4px', backgroundColor: 'lightsteelblue', objectFit: 'contain' }} 
									alt={subject.id}
								/>
												
								<input type="file" accept="image/*" name="photo" ref={input => this.inputPhoto = input} onChange={this.subjectPhotoChange} hidden />
								<br />
								
								<Button type="button" onClick={this.selectPhoto} primary>Выберите файл</Button>
								<Button type="button" onClick={this.clearPhoto} disabled={!this.state.photo}>Очистить</Button>							
							</Form.Field>							
						</Form.Group>

						<Form.Group inline>
							<Form.Field as="label" width={4}>Зарегистрирован</Form.Field>
							<Form.Field as="span" width={12}>{subject.created_at.toLocaleString('ru-RU')}</Form.Field>
						</Form.Group>

						<Form.Group inline>
							<Form.Field as="label" width={4}>Изменён</Form.Field>
							<Form.Field as="span" width={12}>{subject.updated_at.toLocaleString('ru-RU')}</Form.Field>
						</Form.Group>

						<Form.Group inline>
							<Form.Field as="label" width={4}>Находится в</Form.Field>
							<Form.Field width={12}>
								<List bulleted horizontal>
								{ 	
									placePath(subject.place).map(
										(item, i, array) => (
											<List.Item key={i}>{i < array.length - 1 ? item.name : <Link to={`/structure/${array.map(item => item.id).join('/')}`}>{item.name}</Link>}</List.Item>											
										)
									)
								}							    
							  </List>
							</Form.Field>
						</Form.Group>

						<Message
				      error
				      header="Ошибка при записи изменений"
				      content={(this.state.error && this.state.error.message) ? this.state.error.message : 'Нет сообщения'}
				    />
					</Form>
				</Segment>

				<Segment vertical>
					<Button form="form-subject-id" type="submit" positive disabled={!this.state.updated}><Icon name="checkmark" /> Записать</Button>
					<Button form="form-subject-id" type="reset"><Icon name="refresh" /> Обновить</Button>
				</Segment>				
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