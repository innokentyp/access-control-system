import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Breadcrumb } from 'semantic-ui-react'

import * as actions from '../store/actions/subjects'

class PersonalEditor extends Component {
	constructor(props) {
    super(props)

    this.state = { subject: this.props.subjects.find(item => item.id === this.props.match.params.id) }
  }

	allClick = (e) => {
		window.sessionStorage.removeItem('subjects-selected-id')
	}

	render() {
		console.log(`render: ${this.constructor.name}`)

		const { subject } = this.state

		return (
			<Container as="section">
				<Breadcrumb>
			    <Breadcrumb.Section link as={Link} to="/personal" onClick={this.allClick}>Список персонала</Breadcrumb.Section>
			    <Breadcrumb.Divider icon="right arrow" />
			    <Breadcrumb.Section active>{subject.name}</Breadcrumb.Section>
			  </Breadcrumb>

				<h3>{this.constructor.name} match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>

				<p>{JSON.stringify(subject)}</p>
			</Container>
		)
	}	
}

export default connect(
	state => (
		{
			subjects: state.subjects.items
		}
	),
	dispatch => (
		{
			actions: bindActionCreators(actions, dispatch)
		}
	)
)(PersonalEditor)