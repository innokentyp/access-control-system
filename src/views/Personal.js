import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Container, Menu, Input, Dropdown, Table, Icon, Pagination } from 'semantic-ui-react'

import * as actions from '../store/actions/subjects'
import { selectSortingSubjects } from '../store/selectors/subjects'

class Personal extends Component {
	sortingOptions = [
		{ key: '', value: '', text: '( Нет )' },
		{ key: 'id', value: 'id', text: 'ID' },
		{ key: 'name', value: 'name', text: 'Название' },
		{ key: 'created_at', value: 'created_at', text: 'Зарегистрирован' },
		{ key: 'updated_at', value: 'updated_at', text: 'Изменён' }  
	]

	componentDidMount() {
		this.props.totalAllSubjects || this.props.actions.requestSubjects()
	}

	filteringChange = (e, { value }) => {
		const { setFiltering } = this.props.actions

		setFiltering(value)
	}

	sortingChange = (e, { value }) => {
		const { setSorting } = this.props.actions

		setSorting(value)
	}

	addClick = (e, { name }) => {
		console.log(name)

	}

	refreshClick = (e, { name }) => {
		const { requestSubjects } = this.props.actions

		requestSubjects()
	}

	sort = column => () => {
		const { setSorting } = this.props.actions

		setSorting(column)
	}

	pageChange = (e, { activePage }) => {
		const { setActivePage } = this.props.actions

		setActivePage(activePage)
	}

	itemClick = id => e => {
		const { setSelected } = this.props.actions

		setSelected(id)
	}

	render() {
		const { match, subjects, filtering, sorting: column, numberPerPage, activePage } = this.props

		const totalPages = Math.ceil(subjects.length / numberPerPage)
		const start = (activePage - 1) * numberPerPage

		return (
			<Container as="section">
				<h3>{this.constructor.name} match <code>{this.props.match.url}</code> for <code>{this.props.location.pathname}</code></h3>

				<Menu secondary stackable>
					<Menu.Item style={{ padding: '11px 0' }}>
            <Input icon="filter" iconPosition="left" placeholder="Фильтр..." value={filtering} onChange={this.filteringChange} />
          </Menu.Item>
					<Dropdown item placeholder="Сортировка" options={this.sortingOptions} value={column} onChange={this.sortingChange} />
					
					<Menu.Menu position="right">
						<Menu.Item name="add" onClick={this.addClick}>Новая запись</Menu.Item>
						<Menu.Item name="refresh" onClick={this.refreshClick}><Icon name="refresh" /> Обновить</Menu.Item>
					</Menu.Menu>
				</Menu>

				<Table celled stackable sortable>
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
			    		subjects.slice(start, start + numberPerPage).map(
			    			(item, i) => (
			    				<Table.Row key={item.id}>
				    				<Table.Cell>{`0${start + (i + 1)}`.slice(-2)}</Table.Cell>
				    				<Table.Cell style={{ fontFamily: 'monospace' }}><Link to={`${match.url}/${item.id}`} onClick={this.itemClick(item.id)}>{item.id}</Link></Table.Cell>
				    				<Table.Cell>{item.name}</Table.Cell>
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
	state => (
		{ 
			totalAllSubjects: state.subjects.items.length,
			subjects: selectSortingSubjects(state),

			filtering: state.subjects.filtering,
			sorting: state.subjects.sorting,

			numberPerPage: state.subjects.numberPerPage,
			activePage: state.subjects.activePage
		}
	), 
	dispatch => (
		{ 
			actions: bindActionCreators(actions, dispatch)
		}
	)
)(Personal) 