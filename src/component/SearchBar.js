import React, {useState} from 'react';
import { Dropdown, Button, Icon } from 'semantic-ui-react';

const SearchBar = (props) => {
	const [term, setTerm] = useState('');
	const [character, toggleChar] = useState(true);
	const [series, toggleSeries] = useState(true);
	const [events, toggleEvent] = useState(true);
	const [creator, toggleCreator] = useState(true);

	const onFormSubmit = e => {
		e.preventDefault();

		props.onSubmit({
			term
		});
	}

	const toggle = e => {
		console.log(e);
	}

	const options = [
		'characters',
		'series',
		'events',
		'creators',
		'comics'
	]
	return (
		<div>
			<form className='ui inverted form' onSubmit={onFormSubmit}>
				<div className='ui fluid large icon input field'>
					<i className="search icon"></i>
					<input type="text" value={term} placeholder="Search...."
						onChange={e=>setTerm(e.target.value)} />
				</div>
					<div>{
						options.map(item => {
							<Button toggle onClick={toggle} name={item}><Icon name='close'/>{item}</Button>
						})
					}</div>
			</form>
		</div>
	);
}

export default SearchBar;