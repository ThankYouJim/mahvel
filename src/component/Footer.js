import React from 'react';

const Footer = () => {
  return (
    <footer className='ui footer inverted vertical center aligned segment'>
      <div className='ui inverted divided grid'>
        <div className='two column row'>
          <div className='column'>
            <h4 className='ui inverted header'>
              Made using <a href='https://developer.marvel.com/'>Marvel API</a>
            </h4>
          </div>
          <div className='column'>
            <h4 className='ui inverted header'>Contact Me</h4>
            <div className='ui inverted link list' role='list'>
              <a className='item' role='listitem' 
                href='https://www.linkedin.com/in/jo-chong-a513963a'>LinkedIn</a>
              <a className='item' role='listitem' 
                href='https://github.com/ThankYouJim'>Github</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;