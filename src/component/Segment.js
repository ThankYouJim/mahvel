import React from 'react';
import ImageGrid from './ImageGrid';

class Segment extends React.Component {

	render() {
		return (
      <div className="ui vertical stripe segment">
          <div className="ui container">
              <h3 className="ui header">{this.props.label}</h3>
              <div className="ui container">
                  <ImageGrid results={this.props.results} />
              </div>
          </div>
      </div>
    );	
	}
}

export default Segment;