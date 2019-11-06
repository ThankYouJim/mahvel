import React from 'react';
import SearchBar from './SearchBar';
import ImageGrid from './ImageGrid';
import marvel from '../api/marvel';
import ReactPaginate from 'react-paginate';
import Loader from './Loader';
import '../component/reactPaginate.css';

// q: query, list: an array type
// credit: https://www.peterbe.com/plog/a-darn-good-search-filter-function-in-javascript
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
        cache: [],	// to store all results
        series: [],
        characters: [],
        creators: [],
        events: [],        
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

    /* Priority of display
     * series - eg. The Avengers Series, Spider-man series, may include reboots
     * character
     * creators
     * events/stories - Homepage does not have stories so I'm ignoring

    .limit - the set limited number of returns (default 20)
    .total - resources available out of the limited set
    .count - totla number of result of this call
    .results - list of characters
    */

    async cacheSeries(term) {
        const series = await marvel.get('/series', {
            params: {
                titleStartsWith: term
            }
        })
        if (series !== undefined)
            this.setState({ series });
    }

    async cacheCharacters(term) {
        const characters = await marvel.get('/characters', {
            params: {
                nameStartsWith: term
            }
        });
        if (characters !== undefined)
            this.setState({ characters });
    }

    async cacheCreators(term) {
        const series = await marvel.get('/creators', {
            params: {
                nameStartsWith: term
            }
        })
        if (creators !== undefined)
            this.setState({ creators });
    }

    async cacheEvents(term) {
        const events = await marvel.get('/events', {
            params: {
                nameStartsWith: term
            }
        })
        if (events !== undefined)
            this.setState({ events });
    }

    async cacheComics() {
        console.log("Caching comics!");

        let cache = [];
        //let callLimit = 100;
        const all = await marvel.get('/comics');
        const total = all.data.data.total;
        //const count = all.data.data.count;  // Marvel API's default number of results
        console.log('Total results:', total); 
        cache = all.data.data.results;
        console.log('cache', cache);
        // for (let i = count; i < total; i+=100) {
        //const comics = await marvel.get('/comics', {
        //    params: {
        //        offset: count,
        //        limit: callLimit
        //    }
        //});
        //cache = cache.concat(comics.data.data.results);
        // }
        this.setState({ cache });
    }

    // Bugs: searching using keyword will not load the correct batch, and shows total results of cache
    loadResponse = async (form = { term: '' }) => {
        if (form.term !== '') {
            // first load. If the state cache is empty, load all the comics*
            if (this.state.cache === undefined || this.state.cache.length === 0) {
                // await this.cacheComics();
                await this.cacheCharacters(form.term);
            }

            // console.log('Term: ', form.term);
            // const filter = filterList(form.term, this.state.cache);
            // console.log(filter);
            // this.setState({
            //     filter: filter,
            //     term: form.term,
            //     pages: Math.ceil(filter.length / this.state.limit)
            // });
        }

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

    //changeLimit = limit => {
    //    this.setState({ limit });
    //    console.log(this.state.limit);
        // this.renderContent();	// re-render with new limit per page
    //}

    renderContent() {
        //return (
        //    <div className="ui container">
        //        <h3>{message}</h3>

        //        <div className="showN">
        //            <label>Show: </label>
        //            <div className="ui buttons mini">
        //                <button className="ui button" onClick={e => this.changeLimit(20)}>20</button>
        //                <button className="ui button" onClick={e => this.changeLimit(50)}>50</button>
        //                <button className="ui button" onClick={e => this.changeLimit(100)}>100</button>
        //            </div>
        //        </div>

        //        <ImageGrid results={buffer.slice(this.state.offset, this.state.limit)} />
        //        <div id="react-paginate" className="ui pagination menu">
        //            <ReactPaginate
        //                previousLabel={'previous'}
        //                nextLabel={'next'}
        //                breakLabel={'...'}
        //                breakClassName={'break-me'}
        //                pageCount={this.state.pages}
        //                marginPagesDisplayed={2}
        //                pageRangeDisplayed={5}
        //                onPageChange={this.handlePageClick}
        //                containerClassName={'pagination'}
        //                subContainerClassName={'pages pagination'}
        //                activeClassName={'active'}
        //            />
        //        </div>
        //    </div>
        //);

        // if user has input a search term and the valid results are in the filtered cache
        // TODO: optional segments depending on the results returned
        if (this.state.term !== '' && this.state.comics.length > 0) {
            return (
                <div className="ui vertical stripe segment">
                    <div className="ui container">
                        <span className="ui header">{this.state.filter.length} results for {this.state.term}</span>
                        <div className="ui container">
                            <ImageGrid title='Comics' results={this.state.filter} />
                        </div>
                    </div>
                </div>
            );
        }
        else
            return <span>Nothing to see here.</span>;
    }

    //loading(message) {
    //    if (this.state.loading)
    //        return <Loader message={message} />;
    //}

    // TODO: add graphics on the side of the masthead
    // TODO: add api, github repo, linked in and contact as banner
    render() {
        return (
            <div className='pusher'>
                <div className='ui inverted vertical masthead center aligned segment'>
                    <div className='ui text container'>
                        <h1 className='ui inverted header'>Marvel Comic Viewer</h1>
                        <SearchBar onSubmit={this.loadResponse} />
                    </div>
                </div>
                {this.renderContent()}
            </div>
        );
    }
}

export default App;
