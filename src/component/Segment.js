import React from 'react';
import ImageGrid from './ImageGrid';
import { /*Pagination, Accordion,*/ Icon } from 'semantic-ui-react';

class Segment extends React.Component {

  render() {
    console.log('segment', this.props.results);
    return (

      <div className='ui vertical stripe segment'>
        <div className='ui container'>        
          <h2 className='ui header fluid'>
            {this.props.label} <Icon name='angle down' className="" />
          </h2>
          {
            this.props.results ?
              this.props.results.length > 0 ?
                <ImageGrid results={this.props.results} /> : <label className='meta'>No results.</label>
              : <ImageGrid />
          }

          {/*
             <ReactPaginate
                 previousLabel={'previous'}
                 nextLabel={'next'}
                 breakLabel={'...'}
                 breakClassName={'break-me'}
                 pageCount={this.props.results.total}
                 marginPagesDisplayed={2}
                 pageRangeDisplayed={5}
                 onPageChange={this.handlePageClick}
                 containerClassName={'pagination'}
                 subContainerClassName={'pages pagination'}
                 activeClassName={'active'}
             />
          <div id='react-paginate' className='ui pagination menu'>
            <Pagination defaultActivePage={1} totalPages={this.props.results.total}/>
          </div>
           */}
        </div>
      </div>
    );
  }
}

Segment.defaultProps = {
  label: 'Header'
}

export default Segment;