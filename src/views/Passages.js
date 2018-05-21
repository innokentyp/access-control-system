import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'

class Passages extends Component {
	render() {
		return (
			<Container as="section">
				<h3>{this.constructor.name} match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>	
			</Container>
		)
	} 
}

export default Passages