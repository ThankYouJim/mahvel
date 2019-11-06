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
        const src = path + '/portrait_xlarge.' + extension;

        let label;
        if (this.props.name)
            label = this.props.name;
        else if (this.props.title)
            label = this.props.title;

        return (
            <div className="card" style={{ gridRowEnd: `span ${this.state.spans}` }}>
                <div className="ui centered small image">
                    <img
                        ref={this.imageRef}
                        alt='temp'
                        src={src}
                    />
                </div>
                <div className="content">
                    <div className='center aligned header'>
                        <p>{label}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default ImageThumbnail;