import React from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import ImageGrid from './ImageGrid';
import marvel from '../api/marvel';
import ReactPaginate from 'react-paginate';
import Loader from './Loader';
import '../component/reactPaginate.css';

// async componentDidMount() {
//   const response = await fetch(`https://api.coinmarketcap.com/v1/ticker/?limit=10`);
//   const json = await response.json();
//   this.setState({ data: json });
// }

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

function callCharacters() {
	return marvel.get('/characters');
}

function callComics() {
	let cache = [];
	const firstRun = marvel.get('/comics');
	const total = firstRun.total;
	// for (let i = 20; i < total; i+=100) {
		const comics = marvel.get('/comics', {
			params: {
				offset: 20,
				limit: 100
			}
		});
		cache = [...cache, comics.data.data.results];
	// }
	return cache;
}

function callCreators() {
	return marvel.get('/creators');
}

function callEvents() {
	return marvel.get('./events');
}

// TODO: click on series to get to a temp page showing all comics in series
function callSeries() {
	return marvel.get('./series');
}

function callStories() {
	return marvel.get('./stories');
}

class App extends React.Component {
	state = {
		loading: false,
		cache: [],	// to store the results
		pages: 0,
		term: '',
		limit: 20,	// shows how many results per page
		offset: 0,	// shows different set of results 
		total: 0		// the total number of result
	};

	loadResponse = async(form={term:''}) => {
		this.setState({ loading: true });
		const term = form.term;
		console.log('Searching', term);

		// TODO: add for character, creator etc
		await axios.all([callComics()])
		.then(axios.spread(comics => {
			// deal with results here
			console.log(comics);
			// const datas = comics.data.data;
			// console.log("datas:", datas);
			// const results = datas.results;
			// console.log("Res:", results);
			const filter = filterList(term, comics);

			this.setState({
				loading: false,
				cache: filter,
				pages: Math.ceil(datas.total/datas.limit),
				term: term
			});
		}))
		.catch(error => console.log(error))
		.then(() => console.log("Search done!"));
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
