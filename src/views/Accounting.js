import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'

class Accounting extends Component {
	render() {
		return (
			<Container as="section">
				<h3>Accounting match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>	
			</Container>
		)
	}	
}

export default Accounting