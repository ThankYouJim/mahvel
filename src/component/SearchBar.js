import React from 'react';
import { Dropdown } from 'semantic-ui-react';

class SearchBar extends React.Component {
	state = { 
		term: ''
	 };

	onFormSubmit = e => {
		e.preventDefault();

		this.props.onSubmit({
			term: this.state.term
		});
	}

	render() {
		const testOptions = [
			'characters',
			'series',
			'events',
			'creators',
			'comics'
		]
		return (
			<div>
				<form className='ui inverted form' onSubmit={this.onFormSubmit}>
					<div className='ui fluid large icon input field'>
  					<i className="search icon"></i>
						<input type="text" value={this.state.term} placeholder="Search...."
							onChange={(e)=>this.setState({term: e.target.value})} />
					</div>
				</form>
			</div>
		);
	}
}

export default SearchBar;