import React from 'react';

class SearchBar extends React.Component {
	state = { 
		term: '',
		year1: 1900,
		year2: 2019,
	 };

	onFormSubmit = e => {
		e.preventDefault();

		this.props.onSubmit({
			// todo: other stuff
			term: this.state.term
		});
	}

	render() {
		return (
			<div>
				<form className="ui form" onSubmit={this.onFormSubmit}>
					<div className="ui field">
						<label>Search</label>
						<input type="text" value={this.state.term} 
							onChange={(e)=>this.setState({term: e.target.value})} />
					</div>
				</form>
			</div>
		);
	}
}

export default SearchBar;