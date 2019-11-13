import React from 'react';

class SearchBar extends React.Component {
	state = { 
		term: '',
		// year1: 1900,
		// year2: 2019,
	 };

	onFormSubmit = e => {
		e.preventDefault();

		this.props.onSubmit({
			term: this.state.term
		});
	}

	render() {
		return (
			<div>
				<form className='ui inverted form' onSubmit={this.onFormSubmit}>
					<div className='ui fluid large icon input field'>
						<input type="text" value={this.state.term} placeholder="Search...."
							onChange={(e)=>this.setState({term: e.target.value})} />
  					<i className="search icon"></i>
					</div>
				</form>
			</div>
		);
	}
}

export default SearchBar;