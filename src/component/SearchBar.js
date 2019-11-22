import React, { useState } from 'react';
import { Input, Label, Dropdown, Button, Icon } from 'semantic-ui-react';

const SearchBar = (props) => {
  const [term, setTerm] = useState('');
  const [tags, setTags] = useState([]);
  const options = [
    { key: 'all', text: 'All', value: 'all' },
    { key: 'characters', text: 'Characters', value: 'characters' },
    { key: 'series', text: 'Series', value: 'series' },
    { key: 'events', text: 'Events', value: 'events' },
    { key: 'creators', text: 'Creators', value: 'creators' },
    { key: 'comics', text: 'Comics', value: 'comics' }
  ]

  const onFormSubmit = e => {
    e.preventDefault();

    props.onSubmit({ term, tags });
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
		    	<Dropdown
		    		placeholder='Tags'
		    		multiple
		    		selection
		    		options={options}
		    		onChange={(e,data)=>setTags(data.value)}
	    		/>
				</div>
			</form>

		</div>
  );
}

export default SearchBar;