import React, { useState } from 'react';
import { Input } from 'semantic-ui-react';

const SearchBar = (props) => {
  const [term, setTerm] = useState('');

  const onFormSubmit = e => {
    e.preventDefault();

    props.onSubmit(term.trim());
  }

  return (
    <div className='ui'>

			<form className='ui inverted form' onSubmit={onFormSubmit}>
				<div className='ui fluid large icon input field'>
					<Input 
						icon='search'
						iconPosition='left'
						type='text' 
						value={term} 
						placeholder='Search....'
						onChange={e=>setTerm(e.target.value)}
					/>
				</div>
			</form>

		</div>
  );
}

export default SearchBar;