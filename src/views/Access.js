import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'

class Access extends Component {
	render() {
		return (
			<Container as="section">
				<h3>Access match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>	
			</Container>
		)
	} 
}

export default Access