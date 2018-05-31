import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Container, Menu, Input, Dropdown, Table, Icon, Pagination } from 'semantic-ui-react'

import * as actions from '../store/actions/personal'
import * as selectors from '../store/selectors/personal'

class Personal extends Component {
	sortingOptions = [
		{ key: '', value: '', text: '( Нет )' },
		{ key: 'id', value: 'id', text: 'ID' },
		{ key: 'name', value: 'name', text: 'Название' },
		{ key: 'created_at', value: 'created_at', text: 'Зарегистрирован' },
		{ key: 'updated_at', value: 'updated_at', text: 'Изменён' }  
	]

	constructor(props) {
		super(props)

		this.state = { disabledButton: true }
		this.inputFiltering = React.createRef()
	}

	filteringChange = (e) => {
		this.setState({ disabledButton: false }) 
	}

	filteringClick = (e) => {
		const query = { ...this.props.query }
		const filtering = this.inputFiltering.current.inputRef.value.trim()

		if (filtering) {
			query.name_like = filtering
		} else {
			delete query.name_like
		}	
		
		this.props.actions.requestSubjects(query)

		this.setState({ disabledButton: true })
	}

	sortingChange = (e, { value }) => {
		const query = { ...this.props.query }

		if (value) { 
			query._sort = value
		} else {
			delete query._sort
		}	

		this.props.actions.requestSubjects(query)
	}

	addClick = (e, { name }) => {
		console.log(name)

	}

	refreshClick = (e, { name }) => {
		this.props.actions.requestSubjects({ ...this.props.query })
	}

	sort = column => (e) => {
		const query = { ...this.props.query }

		if (column) { 
			query._sort = column
		} else {
			delete query._sort
		}	

		this.props.actions.requestSubjects(query)
	}

	pageChange = (e, { activePage }) => {
		this.props.actions.requestSubjects({ ...this.props.query, _page: activePage })
	}

	itemClick = id => e => {
		window.sessionStorage.setItem('subjects-selected-id', id)
	}

	render() {
		const { match, location, subjects } = this.props

		// http://localhost:8000/subjects?name_like=45&_sort=name&_page=1&_limit=6
		const { _page: activePage, _limit: numberPerPage, name_like: filtering = '', _sort: column = '' } = this.props.query

		const [ totalPages, start ] = [ Math.ceil(4096 / numberPerPage), (activePage - 1) * numberPerPage ] 

		return (
			<Container as="section">
				<h3>{this.constructor.name} match <code>{match.url}</code> for <code>{location.pathname}</code></h3>

				<Menu secondary stackable>
					<Menu.Item style={{ padding: '11px 0' }}>
            <Input ref={this.inputFiltering} action={{ disabled: this.state.disabledButton, color: 'teal', icon: 'filter', onClick: this.filteringClick }} placeholder="Фильтр..." defaultValue={filtering} onChange={this.filteringChange} />
          </Menu.Item>
					<Dropdown item placeholder="Сортировка" options={this.sortingOptions} value={column} onChange={this.sortingChange} />
					
					<Menu.Menu position="right">
						<Menu.Item name="add" onClick={this.addClick}>Новая запись</Menu.Item>
						<Menu.Item name="refresh" onClick={this.refreshClick}><Icon name="refresh" /> Обновить</Menu.Item>
					</Menu.Menu>
				</Menu>

				<Table compact celled striped stackable sortable>
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
			    		subjects.map(
			    			(item, i) => (
			    				<Table.Row key={item.id}>
				    				<Table.Cell>{`000${start + (i + 1)}`.slice(-4)}</Table.Cell>
				    				<Table.Cell style={{ fontFamily: 'monospace' }}><Link to={`${match.url}/${item.id}`} onClick={this.itemClick(item.id)}>{item.id}</Link></Table.Cell>
				    				<Table.Cell>{item.name ? item.name : '(Нет)'}</Table.Cell>
				    				<Table.Cell>{item.created_at.toLocaleString('ru-RU')}</Table.Cell>
				    				<Table.Cell>{item.updated_at.toLocaleString('ru-RU')}</Table.Cell>
			    				</Table.Row>			    				
			    			)
			    		)	
			    	}
			    </Table.Body>

			    <Table.Footer fullWidth>
			      <Table.Row>
			        <Table.HeaderCell />
			        <Table.HeaderCell colSpan='4' textAlign='center'>
			        	<Pagination 
			        		activePage={activePage}							    
							    firstItem={{ content: <Icon name='angle double left' />, icon: true, disabled: activePage === 1 }}
							    prevItem={{ content: <Icon name='angle left' />, icon: true, disabled: activePage === 1 }}
							    nextItem={{ content: <Icon name='angle right' />, icon: true, disabled: activePage === totalPages }}
							    lastItem={{ content: <Icon name='angle double right' />, icon: true, disabled: activePage === totalPages }}
							    totalPages={totalPages}
							    onPageChange={this.pageChange}
			        	/>
			        </Table.HeaderCell>
			      </Table.Row>
			    </Table.Footer>
			  </Table>
			</Container>
		)
	}
}

export default connect(
	(state, props) => (
		{ 
			query: selectors.getQuery(state),
			subjects: selectors.getSubjects(state)				
		}
	), 
	dispatch => (
		{ 
			actions: bindActionCreators(actions, dispatch)		
		}
	)
)(Personal) 