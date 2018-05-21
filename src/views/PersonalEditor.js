import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Breadcrumb } from 'semantic-ui-react'

import * as actions from '../store/actions/subjects'

class PersonalEditor extends Component {
	allClick = (e) => {
		const { setSelected } = this.props.actions

		setSelected()
	}

	render() {
		console.log(`render: ${this.constructor.name}`)

		return (
			<Container as="section">
				<Breadcrumb>
			    <Breadcrumb.Section link as={Link} to="/personal" onClick={this.allClick}>Список персонала</Breadcrumb.Section>
			    <Breadcrumb.Divider icon="right arrow" />
			    <Breadcrumb.Section active>{this.props.match.params.id}</Breadcrumb.Section>
			  </Breadcrumb>

				<h3>{this.constructor.name} match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>

				<p>{this.props.match.params.id}</p>	
			</Container>
		)
	}	
}

export default connect(
	state => (
		{}
	),
	dispatch => (
		{
			actions: bindActionCreators(actions, dispatch)
		}
	)
)(PersonalEditor)