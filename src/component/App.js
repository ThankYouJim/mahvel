import React from 'react';
import SearchBar from './SearchBar';
import ImageGrid from './ImageGrid';
import marvel from '../api/marvel';
import ReactPaginate from 'react-paginate';
import Loader from './Loader';
import '../component/reactPaginate.css';

// credit: https://www.peterbe.com/plog/a-darn-good-search-filter-function-in-javascript
// q: query, list: an array type
function filterList(q, list) {
  function escapeRegExp(s) {
    return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  }
  const words = q
    .split(/\s+/g)
    .map(s => s.trim())
    .filter(s => !!s);
  const hasTrailingSpace = q.endsWith(" ");
  const searchRegex = new RegExp(
    words
      .map((word, i) => {
        if (i + 1 === words.length && !hasTrailingSpace) {
          // The last word - ok with the word being "startswith"-like
          return `(?=.*\\b${escapeRegExp(word)})`;
        } else {
          // Not the last word - expect the whole word exactly
          return `(?=.*\\b${escapeRegExp(word)}\\b)`;
        }
      })
      .join("") + ".+",
    "gi"
  );
  return list.filter(item => {
    return searchRegex.test(item.title);
  });
}

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
		// const length = await cache.store.length();
		console.log('Searching', term);
		// console.log('Cache length:', length);

		await marvel.get('/comics', {
			params: {
				limit: this.state.limit,
				offset: this.state.offset
			}
		})
		.then(searchResult => {
			const datas = searchResult.data.data;
			const results = datas.results;
			console.log("Res:", results);
			// const filter = results.filter(result => result.title.toLowerCase().indexOf(term.toLowerCase()) > -1);
			const filter = filterList(term, results);

			// if available != 0
			// [result].characters.items[].name
			// [result.creators.items[].name
			// + events
			// [result].series.name
			// + stories

			this.setState({
				loading: false,
				cache: filter,
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
		// todo: using cache, reload page
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
