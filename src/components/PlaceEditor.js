import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Segment, Form, Button, List } from 'semantic-ui-react'

import * as actions from '../store/actions/structure'
import * as selectors from '../store/selectors/structure'

class PlaceEditor extends Component {
	constructor(props) {
		super(props)
		
		const { 
			match: { params: { id } }, 
			structure: { places: { [id]: place = { id, name: id, maximum_control: 0 } } } 
		} = props

		this.state = { place: { ...place }, updated: false }
	}

	save() {
		const { place, updated } = this.state

		if (updated)	
			this.props.actions.updatePlace(place.id, place, selectors.placeRoot(place).id)		
	}

	componentWillUnmount() {
		this.save()
	}

	UNSAFE_componentWillReceiveProps(nextProps) {		
		const { 
			match: { params: { id } }, 
			structure: { places: { [id]: place = { id, name: id, maximum_control: 0 } } } 
		} = nextProps

		this.setState({ place: { ...place }, updated: false	})
	}

	placeNameChange = (e) => {
		this.setState({ place: { ...this.state.place, name: e.target.value }, updated: true })
	}

	placeMaximumControlChange = (e) => {
		this.setState({ place: { ...this.state.place, maximum_control: e.target.value }, updated: true })
	}

	formPlaceSubmit = (e) => {
		e.preventDefault()
		
		this.save()
	}

	formPlaceReset = (e) => {
		e.preventDefault()

		const { 
			match: { params: { id } }, 
			structure: { places: { [id]: place = { id, name: id, maximum_control: 0 } } } 
		} = this.props		

		this.setState({ place: { ...place }, updated: false	})
	}

	render() {
		console.log(`render: ${this.constructor.name}`)

		const { match: { url }, structure: { places } } = this.props		
		const { place, updated } = this.state
		
		// <pre>{JSON.stringify(place, null, 2)}</pre>

		return (
			<Fragment>
				<Segment vertical>
					<Form name="form-place" id="form-place-id" onSubmit={this.formPlaceSubmit} onReset={this.formPlaceReset} autoComplete="off">
						<Form.Group inline>
							<Form.Field as="label" width={6}>ID</Form.Field>
							<Form.Field as="span" width={10}>{place.id}</Form.Field>
						</Form.Group>

						<Form.Group inline>
			      	<Form.Field as="label" width={6} htmlFor="form-place-name">Название</Form.Field>
			      	<Form.Field width={10}>
			      		<input type="text" name="place-name" id="form-place-name" value={place.name} onChange={this.placeNameChange} />
			      	</Form.Field>
			      </Form.Group>	
						
						<Form.Group inline>
			      	<Form.Field as="label" width={6} htmlFor="form-place-maximum-control">Время повторного входа</Form.Field>
			      	<Form.Field width={10}>
			      		<input type="text" name="place-maximum-control" id="form-place-maximum-control" value={place.maximum_control} onChange={this.placeMaximumControlChange} />
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

						<Form.Group inline>
							<Form.Field width={6}></Form.Field>
							<Form.Field width={10}>
								<Button.Group>
							    <Button type="submit" positive disabled={!updated}>Ok</Button>
							    <Button.Or text="&" />
							    <Button type="reset" disabled={!updated}>Отмена</Button>
							  </Button.Group>
							</Form.Field>
						</Form.Group>
					</Form>
				</Segment>
			</Fragment>					
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
) (PlaceEditor)