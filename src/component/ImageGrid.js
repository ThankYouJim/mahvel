import React from 'react';
import ImageThumbnail from './ImageThumbnail';

class ImageGrid extends React.Component {

	render() {
		// Map the required fields into new ImageThumbnails
		const thumbnails = this.props.results.map(result => {
			let label;
			if (result.name !== undefined)
				label = result.name;
			else if (result.title !== undefined)
				label = result.title
			else if (result.fullName !== undefined)
				label = result.fullName
			return <ImageThumbnail key={result.id} thumbnail={result.thumbnail} label={label}/>
		});

		return (
      <div className='ui stackable five cards'>
				{thumbnails}
			</div>
		);
	}
}

export default ImageGrid;