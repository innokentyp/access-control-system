import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'

export default class NoMatch extends Component {
	render() {
		return (
			<Container as="section">
		    <h3>No match for <code>{this.props.location.pathname}</code></h3>
		  </Container>
		)
	} 
}

