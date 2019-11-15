import React from 'react';
import ImageGrid from './ImageGrid';

class Segment extends React.Component {

	render() {
		return (
      <div className='ui vertical stripe segment'>
          <div className='ui container'>
                <h2 className='ui header active title'>
                  {this.props.label}
                </h2>
                <div className='active content'>
                    <ImageGrid results={this.props.results} />
                </div>
          </div>
      </div>
    );	
	}
}

export default Segment;