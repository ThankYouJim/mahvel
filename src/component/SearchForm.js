// NOT USING THIS


import React from 'react';

class SearchForm extends React.Component {
	render() {
		return (
			<div>
				<form className="ui form">

					<div className="inline fields">
		      	<label>Year</label>
						<div className="field">
		      		<input type="number" value={this.state.year1}
								onChange={(e)=>this.setState({year1: e.target.value})} />
		    		</div>
			      <label>to</label>
						<div className="field">
			      	<input type="number" value={this.state.year2}
								onChange={(e)=>this.setState({year2: e.target.value})} />
		    		</div>
		    	</div>

				</form>
			</div>
		);
	}
}

export default SearchForm;