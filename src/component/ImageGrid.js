import React from 'react';
import ImageThumbnail from './ImageThumbnail';

class ImageGrid extends React.Component {

	render() {
		const thumbnails = this.props.results.map(comic => {
			return <ImageThumbnail key={comic.id} thumbnail={comic.thumbnail} title={comic.title}/>
		});

		return (
			<div>
				<h3 className='ui header'>
					{this.props.title}
				</h3>
	      <div className='ui four stackable cards'>
					{thumbnails}
				</div>
			</div>
		);
	}
}

export default ImageGrid;