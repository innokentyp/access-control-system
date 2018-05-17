import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Container, Dropdown, Table, Icon, Button } from 'semantic-ui-react'

import * as actions from '../store/actions/subjects'
import { selectAllSubjects } from '../store/selectors/subjects'

class Personal extends Component {
	sortingOptions = [
		{ key: '', value: '', text: '( Нет )' },
		{ key: 'id', value: 'id', text: 'ID' },
		{ key: 'name', value: 'name', text: 'Название' },
		{ key: 'created_at', value: 'created_at', text: 'Зарегистрирован' },
		{ key: 'updated_at', value: 'updated_at', text: 'Изменён' }  
	]

	componentDidMount() {
		if (this.props.subjects.length === 0) {

			this.props.actions.requestSubjects()
		}
	}

	sortingChange = (e, data) => {
		var { setSorting } = this.props.actions

		setSorting(data.value)
	}

	sort = column => () => {
		var { setSorting } = this.props.actions

		setSorting(column)
	}

	render() {
		var { sorting: column } = this.props

		return (
			<Container as="section">
				<h3>Personal match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>

				<Dropdown placeholder="( Нет )" options={this.sortingOptions} value={this.props.sorting} onChange={this.sortingChange} />

				<Table celled sortable>
			    <Table.Header>
			      <Table.Row>
			        <Table.HeaderCell collapsing onClick={this.sort('')} />
			        <Table.HeaderCell width={3} sorted={column === 'id' ? 'ascending' : null} onClick={this.sort('id')}>ID</Table.HeaderCell>
			        <Table.HeaderCell sorted={column === 'name' ? 'ascending' : null} onClick={this.sort('name')}>Название</Table.HeaderCell>
			        <Table.HeaderCell width={3} sorted={column === 'created_at' ? 'ascending' : null} onClick={this.sort('created_at')}>Зарегистрирован</Table.HeaderCell>
			        <Table.HeaderCell width={3} sorted={column === 'updated_at' ? 'ascending' : null} onClick={this.sort('updated_at')}>Изменён</Table.HeaderCell>
			      </Table.Row>
			    </Table.Header>

			    <Table.Body>
			    	{
			    		this.props.subjects.map(
			    			(item, i) => (
			    				<Table.Row key={item.id}>
				    				<Table.Cell>{i+1}</Table.Cell>
										{
											(new RegExp(`/${item.id}$`)).test(this.props.location.pathname)
											?
											<Table.Cell colSpan="4">{item.name}</Table.Cell>
											: 
											<Fragment>
												<Table.Cell selectable warning><Link to={`${this.props.match.url}/${item.id}`}>{item.id}</Link></Table.Cell>
						    				<Table.Cell>{item.name}</Table.Cell>
						    				<Table.Cell>{item.created_at.toLocaleString('ru-RU')}</Table.Cell>
						    				<Table.Cell>{item.updated_at.toLocaleString('ru-RU')}</Table.Cell>
					    				</Fragment>
										}
			    				</Table.Row>			    				
			    			)
			    		)	
			    	}
			    </Table.Body>

			    <Table.Footer fullWidth>
			      <Table.Row>
			        <Table.HeaderCell />
			        <Table.HeaderCell colSpan='4'>
			          <Button floated='right' icon labelPosition='left' primary size='small'>
			            <Icon name='user' /> Новая персона
			          </Button>
			          <Button size='small'>Approve</Button>
			          <Button disabled size='small'>Approve All</Button>
			        </Table.HeaderCell>
			      </Table.Row>
			    </Table.Footer>
			  </Table>

			</Container>
		)
	}
}

export default connect(
	state => (
		{ 
			sorting: state.subjects.sorting,
			subjects: selectAllSubjects(state)
		}
	), 
	dispatch => (
		{ 
			actions: bindActionCreators(actions, dispatch)
		}
	)
)(Personal) 