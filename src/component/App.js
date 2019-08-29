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

// function callCharacters() {
// 	return marvel.get('/characters');
// }

// function callCreators() {
// 	return marvel.get('/creators');
// }

// function callEvents() {
// 	return marvel.get('./events');
// }

// // TODO: click on series to get to a temp page showing all comics in series
// function callSeries() {
// 	return marvel.get('./series');
// }

// function callStories() {
// 	return marvel.get('./stories');
// }

class App extends React.Component {
	state = {
		loading: false,
		cache: [],	// to store the results
		filter: [],	// the filtered results from cache
		term: '',
		pages: 0, 	// total of pages for paginator
		limit: 20,	// shows how many results per page
		offset: 0,	// shows different set of results for paginator
		// total: 0		// the total number of result
	};

	// async componentDidMount() {
	// 	this.setState({ loading: true });
	//   // const response = await fetch(`https://api.coinmarketcap.com/v1/ticker/?limit=10`);
	//   // const json = await response.json();
	//   // this.setState({ data: json });
	//   const comics =	cacheComics();
	//   this.setState({
	//   	loading: true,
	//   	cache: comics.results,
	//   	pages: Math.ceil(comics.total/comics.limit),
	//   })
	// }

	async cacheComics() {
		let cache = [];
		let callLimit = 100;
		const firstRun = await marvel.get('/comics');
		const total = firstRun.data.data.total;
		const count = firstRun.data.data.count;
		cache = firstRun.data.data.results;
		// for (let i = count; i < total; i+=100) {
			const comics = await marvel.get('/comics', {
				params: {
					offset: count,
					limit: callLimit
				}
			});
			cache = cache.concat(comics.data.data.results);
		// }
		this.setState({
			cache: cache,
			pages: Math.ceil(total/this.state.limit)
		});
	}

	loadResponse = async(form={term:''}) => {
		this.setState({ loading: true });

		const term = form.term;
		console.log('Searching', term);

		// cache the comics if no request has been called yet
		if (this.state.cache === undefined || this.state.cache.length === 0) {
			this.cacheComics();
		}

		// if user has input a search term, update the filter-cache, term, and pages
		if (term !== '') {
			const filter = filterList(term, this.state.cache);
			this.setState({
				filter: filter,
				term: term,
				pages: Math.ceil(filter.length()/this.state.limit)
			})
		}
		// clean up the search result cache
		else {
			this.setState({
				filter: [],
				term: '',
				pages: Math.ceil(this.state.cache.length/this.state.limit)
			})
		}
		this.setState({ loading: false });	// finally, set loading to false to stop the loading animation

		// TODO: add for character, creator etc
		// await axios.all(	cacheComics()])
		// .then(axios.spread(comics => {
			// deal with results here
	// 	}))
	// 	.catch(error => console.log(error))
	// 	.then(() => console.log("Search done!"));
	}

	handlePageClick = data => {
    let selected = data.selected;
    let offset = Math.ceil(selected * this.state.limit);

    this.setState({ offset }, () => {
      // this.loadResponse();
    });
	}

	changeLimit = limit => {
		this.setState({ limit });
		console.log(this.state.limit);
		// this.renderContent();	// re-render with new limit per page
	}

	renderContent() {
		let message;
		let buffer;
		if (this.state.term && this.state.filter.length > 0) {
			buffer = this.state.filter;
		}
		else {
			buffer = this.state.cache;
		}

		if (buffer === undefined && buffer.length === 0) {
			message = 'No results for ' + this.state.term;
		}
		else {
			message = 'Showing ' + this.state.limit + ' results for ' + this.state.term;
		}

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

					<ImageGrid results={buffer.slice(this.state.offset, this.state.limit)} />
					<div id="react-paginate" className="ui pagination menu">
						<ReactPaginate
				      previousLabel={'previous'}
				      nextLabel={'next'}
				      breakLabel={'...'}
				      breakClassName={'break-me'}
				      pageCount={this.state.pages}
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

	loading(message) {
		if (this.state.loading)
			return <Loader message={message} />;
	}

	render() {
		return (
			<div className="ui container">
				<SearchBar onSubmit={this.loadResponse}/>
				{this.loading("Searching...")}
				{this.renderContent()}
			</div>
		);
	}
}

export default App;
