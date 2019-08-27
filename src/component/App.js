import React from 'react';
import SearchBar from './SearchBar';
import ImageGrid from './ImageGrid';
import marvel from '../api/marvel';
import ReactPaginate from 'react-paginate';
import Loader from './Loader';
import '../component/reactPaginate.css';

class App extends React.Component {
	state = {
		loading: false,
		cache: [],
		pages: 0,
		term: '',
		limit: 20,
		offset: 0
	};

	loadResponse = async(form={term:''}) => {
		this.setState({ loading: true });
		const term = form.term;
		console.log('Searching', term, this.state.loading);

		// + characters
		// + creators
		// + comic
		// + events
		// + series
		// + stories

		await marvel.get('/comics', {
			params: {
				limit: this.state.limit,
				offset: this.state.offset
			}
		})
		.then(searchResult => {
			const datas = searchResult.data.data;
			const results = datas.results;

			// const filter = results.filter(result => result.title.toLowerCase().indexOf(term.toLowerCase()) > -1);

			this.setState({
				loading: false,
				cache: results,
				// cache: filter,
				pages: Math.ceil(datas.total/datas.limit),
				term: term
			})
		})
		.catch(error => {
			console.log(error);
		})
		.then(() => {
			console.log('Finish!');
		});
	}

	handlePageClick = data => {
    let selected = data.selected;
    let offset = Math.ceil(selected * this.state.limit);

    this.setState({ offset }, () => {
      this.loadResponse();
    });
	}

	changeLimit = limit => {
		this.setState({ limit });
		console.log(this.state.limit);
		// todo: using cache, reloadd page
	}

	renderContent() {
		let message;
		if (this.state.term) {
			const n = this.state.cache.length;
			if (n !== 0)
				message = 'Showing ' + n + ' results for ' + this.state.term;
			else 
				message = 'No results for ' + this.state.term;
		}
		else
			message = 'Showing all results';

		if (this.state.cache.length !== 0) {
			return (
				<div className="ui container">
				<h3>{message}</h3>

				<div className="showN">
					<label>Show: </label>
					<div className="ui buttons mini">
						<button className="ui button" onClick={e=>this.changeLimit(20)}>20</button>
						<button className="ui button" onClick={e=>this.changeLimit(50)}>50</button>
						<button className="ui button" onClick={e=>this.changeLimit(100)}>100</button>
					</div>
				</div>

				<ImageGrid results={this.state.cache} />
					<div id="react-paginate" className="ui pagination menu">
						<ReactPaginate
				      previousLabel={'previous'}
				      nextLabel={'next'}
				      breakLabel={'...'}
				      breakClassName={'break-me'}
				      pageCount={this.state.pageCount}
				      marginPagesDisplayed={2}
				      pageRangeDisplayed={5}
				      onPageChange={this.handlePageClick}
				      containerClassName={'pagination'}
				      subContainerClassName={'pages pagination'}
				      activeClassName={'active'}
						/>
					</div>
				</div>
			);
		}
	}

	loading() {
		if (this.state.loading)
			return <Loader message="Searching..." />;
	}

	render() {
		return (
			<div className="ui container">
				<SearchBar onSubmit={this.loadResponse}/>
				{this.loading()}
				{this.renderContent()}
			</div>
		);
	}
}

export default App;
