import React from 'react';
import ImageGrid from './ImageGrid';
import { Pagination } from 'semantic-ui-react';
// import ReactPaginate from 'react-paginate';
// import '../component/reactPaginate.css';

class Segment extends React.Component {

	render() {
    console.log(this.props.results);
		return (
      <div className='ui vertical stripe segment'>
          <div className='ui container'>
            <h2 className='ui header active title'>
              {this.props.label}
            </h2>
            <div className='active content'>
                <ImageGrid results={this.props.results.results} />
            </div>

            {/* Paginate 
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
               />*/}
            <div id='react-paginate' className='ui pagination menu'>
              <Pagination defaultActivePage={1} totalPages={this.props.results.total}/>
            </div>
          </div>
      </div>
    );	
	}
}

export default Segment;