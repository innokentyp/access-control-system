import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Segment, Form, Button, Icon, Message, List } from 'semantic-ui-react'

import * as actions from '../store/actions/structure'
import * as selectors from '../store/selectors/structure'

class PlaceEditor extends Component {
	constructor(props) {
		super(props)

		const { place: { name, maximum_control } } = props

		this.state = {
			name,
			maximum_control,

			updated: false,

			loading: false,
			error: null
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { place: { name, maximum_control } } = nextProps

		this.setState( 
			{
				name,
				maximum_control,

				updated: false,

				loading: false,
				error: null
			}
		)
	}

	placeNameChange = (e) => {
		this.setState({ name: e.target.value, updated: true })
	}

	placeMaximumControlChange = (e) => {
		this.setState({ maximum_control: e.target.value, updated: true })
	}

	formPlaceSubmit = (e) => {
		e.preventDefault()

		this.setState({ loading: true, error: null })

		const { match: { params: { id } } } = this.props
		const { name, maximum_control } = this.state
		
    const data = { 
			name,
			maximum_control
		}	

		this.props.actions.patch(id, data)
			.catch(
			  error => {
			  	this.setState({ loading: false, error })				    
			  }
		  )    
	}

	formPlaceReset = (e) => {
		e.preventDefault()

		const { place: { name, maximum_control } } = this.props

		this.setState( 
			{
				name,
				maximum_control,

				updated: false,
				error: null
			}
		)
	}

	render() {
		const { match: { url, params: { id } }, structure: { places }, place } = this.props
		const { name, maximum_control, updated, loading, error } = this.state
		
		// <pre>{JSON.stringify(place, null, 2)}</pre>

		return (
			<Fragment>
				<Segment vertical>
					<Form name="form-place" id="form-place-id" loading={loading} error={!!error} onSubmit={this.formPlaceSubmit} onReset={this.formPlaceReset} autoComplete="off">
						<Form.Group inline>
							<Form.Field as="label" width={6}>ID</Form.Field>
							<Form.Field as="span" width={10}>{id}</Form.Field>
						</Form.Group>

						<Form.Group inline>
			      	<Form.Field as="label" width={6} htmlFor="form-place-name">Название</Form.Field>
			      	<Form.Field width={10}>
			      		<input type="text" name="place-name" id="form-place-name" value={name} onChange={this.placeNameChange} autoComplete="nope" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
			      	</Form.Field>
			      </Form.Group>	
						
						<Form.Group inline>
			      	<Form.Field as="label" width={6} htmlFor="form-place-maximum-control">Время повторного входа</Form.Field>
			      	<Form.Field width={10}>
			      		<input type="text" name="place-maximum-control" id="form-place-maximum-control" value={maximum_control} onChange={this.placeMaximumControlChange} autoComplete="nope" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
			      	</Form.Field>
			      </Form.Group>

						{ 
							place.places
							&&
							<Form.Group inline>
								<Form.Field as="label" width={6} style={{ alignSelf: 'start' }}>Включает</Form.Field>
								<Form.Field width={10}>									
									<List>
										{ 	
											place.places.map(
												(item, i, array) => (
													<List.Item key={item}><Link to={`${url}/${item}`}>{places[item].name}</Link></List.Item>											
												)
											)
										}							    
								  </List>																	
								</Form.Field>
							</Form.Group>
						}

						<Message
				      error
				      header="Ошибка при записи изменений"
				      content={(error && error.message) ? error.message : 'Нет сообщения'}
				    />
					</Form>
				</Segment>

				<Segment vertical>
					<Button form="form-place-id" type="submit" positive disabled={!updated}><Icon name="checkmark" /> Записать</Button>
					<Button form="form-place-id" type="reset"><Icon name="refresh" /> Обновить</Button>
				</Segment>
			</Fragment>					
		)
	}
}

export default connect(
	(state, props) => (
		{ 
			structure: selectors.getStructure(state),
			place: selectors.getPlace(state, props.match.params.id)
		}
	), 
	dispatch => (
		{ 
			actions: bindActionCreators(actions, dispatch)		
		}
	)
) (PlaceEditor)