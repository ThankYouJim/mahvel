import React from 'react';
import ImageThumbnail from './ImageThumbnail';

class ImageGrid extends React.Component {

	render() {
		const comics = this.props.results.map(comic => {
			return <ImageThumbnail key={comic.id} thumbnail={comic.thumbnail} title={comic.title}/>
		});

		return (
			<div className='image-grid'>
				{comics}
			</div>
		);
	}
}

export default ImageGrid;