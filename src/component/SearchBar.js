import React, { useState } from 'react';
import { Label, Dropdown, Button, Icon } from 'semantic-ui-react';

const TagGroup = props => {

  // const options = [
  //   [toggleCharacters, characters],
  //   [toggleSeries, series],
  //   [toggleEvents, events],
  //   [toggleCreators, creators],
  //   [toggleComics, comics]
  // ]
  const options = [
    'characters',
    'series',
    'events',
    'creators',
    'comics'
  ]

	const tags = options.map(item=>{return <Tag value={item}/>})

	return (
		<div>
			<label className='ui text'>Search by:</label>
			{tags}
		</div>
	);
}

const Tag = props => {

	return <Button>{props.value}</Button>
						// <Button toggle color='red' active={item[0]} onClick={item[0]} name={item[1]}><Icon name='close'/>item[1]</Button>
}

const SearchBar = (props) => {
  const [term, setTerm] = useState('');

  const [characters, toggleCharacters] = useState(true);
  const [series, toggleSeries] = useState(true);
  const [events, toggleEvents] = useState(true);
  const [creators, toggleCreators] = useState(true);
  const [comics, toggleComics] = useState(true);

  const onFormSubmit = e => {
    e.preventDefault();

    props.onSubmit({ term });
  }
  return (
    <div className='ui'>
			<form className='ui inverted form' onSubmit={onFormSubmit}>
				<div className='ui fluid large icon input field'>
					<i className='search icon'></i>
					<input type='text' value={term} placeholder='Search....'
						onChange={e=>setTerm(e.target.value)} />
				</div>
				<TagGroup />
			</form>
		</div>
  );
}

export default SearchBar;