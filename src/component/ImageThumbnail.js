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
        const alt = 'Image for ' + this.props.label;
        const src = path + '/portrait_uncanny.' + extension; // returns an image ~300px

        // , gridRowEnd: `span ${this.state.spans}` 
        return (
            <div className="card" style={{ width: '150px' }}>
                <div className="ui centered image">
                    <img
                        ref={this.imageRef}
                        alt={alt}
                        src={src}
                    />
                </div>
                <div className="content">
                    <div className='center aligned header'>
                        <p>{this.props.label}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default ImageThumbnail;