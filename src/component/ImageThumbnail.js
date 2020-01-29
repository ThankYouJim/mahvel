import React from 'react';
import './ImageGrid.css';

const ImageThumbnail = props => {
    // setSpans = () => {
    //     const height = this.imageRef.current.clientHeight;
    //     const spans = Math.ceil(height / 10);
    //     this.setState({ spans });
    // }

    const { path, extension } = props.thumbnail;
    const alt = 'Image for ' + props.label;
    const src = path + '/portrait_uncanny.' + extension;

    // , gridRowEnd: `span ${this.state.spans}` 
    return (
      <div className="card" style={{ width: '150px' }}>
        <div className="ui centered image">
          <img
              ref={React.createRef()}
              alt={alt}
              src={src}
          />
        </div>
        <div className="content">
          <div className='center aligned header'>
            <p>{props.label}</p>
          </div>
        </div>
      </div>
    );
}

export default ImageThumbnail;