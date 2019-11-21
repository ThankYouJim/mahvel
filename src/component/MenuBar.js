import React from 'react';

function MenuBar() {
    return (
        <div className='ui container'>
	<div className='ui inverted compact labeled menu'>
		<a 
		className='item' 
		href='https://www.linkedin.com/in/jo-chong-a513963a/'>
		<i className='icon link linkedin large'></i>LinkedIn
		</a>
											<a 
		className='item' 
		href='https://github.com/ThankYouJim/mahvel'>
		<i className='icon link github large'></i>Source
</a>
		</div>
		</div>
    );
}

export default MenuBar;