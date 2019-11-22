import React from 'react';
import ImageThumbnail from './ImageThumbnail';

class ImageGrid extends React.Component {

  render() {
    const thumbnails = this.props.results.map(result => {
      let label;
      if (result.name !== undefined)
        label = result.name;
      else if (result.title !== undefined)
        label = result.title;
      else if (result.fullName !== undefined)
        label = result.fullName;
      else
        label = result.label;
      return <ImageThumbnail key={result.id} thumbnail={result.thumbnail} label={label}/>
    });

    return (
      <div className='ui stackable five cards'>
				{thumbnails}
			</div>
    );
  }
}


ImageGrid.defaultProps = {
  results: [{
    label: '???',
    id: 0,
    thumbnail: {
      path: 'https:/via.placeholder.com/150x225',
      extension: 'jpg'
    }
  }]
}

export default ImageGrid;