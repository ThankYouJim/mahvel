import React from 'react';

const Loader = props => {
	return (
		<div className="ui active inverted dimmer">
		    <div className="ui text loader">Loading {props.message}</div>
		</div>
	);
};

Loader.defaultProps = {
	messsage:'Loading...'
};

export default Loader;