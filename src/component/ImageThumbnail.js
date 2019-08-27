import React from 'react';
import './ImageGrid.css';

class ImageThumbnail extends React.Component {
	constructor(props) {
		super(props);

		// other css helper setters
		this.state = { spans: 0 }

		this.imageRef = React.createRef();
	}

	setSpans = () => {
		const height = this.imageRef.current.clientHeight;
		const spans = Math.ceil(height / 10);
		this.setState({ spans });
	}

	render() {
		const { path, extension } = this.props.thumbnail;
		const src = path + '/portrait_medium.' + extension;

		let label;
		if (this.props.name)
			label = this.props.name;
		else if (this.props.title)
			label = this.props.title;

		return (
			<div style={{ gridRowEnd: `span ${this.state.spans}` }}>
				<img
					ref = {this.imageRef}
					alt = 'temp'
					src = {src}
				/>
				<div className='comic-title'>
					<p>{label}</p>
				</div>
			</div>
		);
	}
}

export default ImageThumbnail;