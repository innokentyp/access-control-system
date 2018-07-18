import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Segment, Form, Button, List, Breadcrumb } from 'semantic-ui-react'

import * as actions from '../store/actions/structure'
import * as selectors from '../store/selectors/structure'

class PlaceEditor extends Component {
	constructor(props) {
		super(props)

		this.state = { place: { ...props.place }, updated: false }
	}

	save() {
		const { place, updated } = this.state

		if (updated)	
			this.props.actions.updatePlace(this.props.place, place)		
	}

	componentWillUnmount() {
		this.save()
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.save()

		this.setState({ place: { ...nextProps.place }, updated: false	})
	}

	placeNameChange = (e) => {
		this.setState({ place: { ...this.state.place, name: e.target.value }, updated: true })
	}

	placeMaximumControlChange = (e) => {		
		var value = parseInt(e.target.value, 10)		

		isNaN(value) || this.setState({ place: { ...this.state.place, maximum_control: value }, updated: true })			
	}

	formPlaceSubmit = (e) => {
		e.preventDefault()
		
		this.save()
	}

	formPlaceReset = (e) => {
		e.preventDefault()

		this.setState({ place: { ...this.props.place }, updated: false	})
	}

	render() {
		//console.log(`render: ${this.constructor.name}`)

		const { match: { url } } = this.props
		const { place, updated } = this.state
		
		// <pre>{JSON.stringify(place, null, 2)}</pre>

		return (
			<Fragment>
				<Breadcrumb>
					{
						selectors.placePath(this.props.place, this.props.structure.places).map(
							(item, i, array) => (
								i < array.length - 1
								?
								<Fragment key={item.id}>
									<Breadcrumb.Section link as={Link} to={`/structure/${array.slice(0,i+1).map(item => item.id).join('/')}`}>{item.name}</Breadcrumb.Section>
				    			<Breadcrumb.Divider icon="right angle" />
			    			</Fragment>
								:
								<Breadcrumb.Section key={item.id} active>{item.name}</Breadcrumb.Section>
							)
						)
					}
			  </Breadcrumb>
				
				<Segment secondary padded="very">
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
													<List.Item key={item.id}><Link to={`${url}/${item.id}`}>{item.name}</Link></List.Item>											
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
							    <Button type="reset" negative={updated} disabled={!updated}>Отмена</Button>
							  </Button.Group>
							</Form.Field>
						</Form.Group>
					</Form>
				</Segment>
			</Fragment>					
		)
	}
}

export default connect(state => ({ state }), dispatch => ({ dispatch }),
	(stateProps, dispatchProps, ownProps) => (
		{ 
			...ownProps,
			structure: stateProps.state.structure,
			place: selectors.getPlace(stateProps.state.structure, ownProps.match.params.id, dispatchProps.dispatch),
			actions: bindActionCreators(actions, dispatchProps.dispatch)
		}	
	)
) (PlaceEditor)