import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const PersonalEditorRoute = ({ authenticated, subjects, component: Component, ...rest }) => (
	<Route 
		{...rest}
		render={
			props => (
				authenticated 
				? 
				(
					subjects.findIndex(item => item.id === props.match.params.id) >= 0
					?
					<Component {...props} />
					:
					<Redirect to="/personal" />
				) 
				: 
				<Redirect to={{ pathname: '/login', state: { from: props.location } }} />
			)	
		}		
	/>
)

export default connect(
	state => (
		{ 
			authenticated: !!state.authentication.user.jwt,
			subjects: state.subjects.items 
		}
	)
)(PersonalEditorRoute)

