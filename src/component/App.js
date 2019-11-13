import React from 'react';
import SearchBar from './SearchBar';
// import ImageGrid from './ImageGrid';
import marvel from '../api/marvel';
// import ReactPaginate from 'react-paginate';
// import Loader from './Loader';
import Segment from './Segment';
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
        series: [],
        characters: [],
        creators: [],
        events: [],        
        comics: [],
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
        return series.data.data.results;
    }

    async cacheCharacters(term) {
        const characters = await marvel.get('/characters', {
            params: {
                nameStartsWith: term
            }
        });
        return characters.data.data.results;
    }

    async cacheCreators(term) {
        const creators = await marvel.get('/creators', {
            params: {
                nameStartsWith: term
            }
        })
        return creators.data.data.results;
    }

    async cacheEvents(term) {
        const events = await marvel.get('/events', {
            params: {
                nameStartsWith: term
            }
        })
    }

    async cacheComics(term) {
        const comics = await marvel.get('/comics', {
            params: {
                titleStartsWith: term
            }
        });
    }

    // Bugs: searching using keyword will not load the correct batch, and shows total results of cache
    loadResponse = async (form = { term: '' }) => {
        if (form.term !== '') {
            const characters = await this.cacheCharacters(form.term);
            console.log(characters);

            const series = await this.cacheSeries(form.term);
            console.log(series);

            const creators = await this.cacheCreators(form.term);
            console.log(creators);

            this.setState({
                characters,
                series,
                creators
            })
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

    renderContent() {
        const test = [{id:1, thumbnail: {path:'abc', extension:'.jpg'}, label:'A-man'}];
        return (
            <div>
                {this.state.characters.length > 0 ? <Segment label='Characters' results = {this.state.characters}/> : null}
                {this.state.series.length > 0 ? <Segment label='Series' results = {this.state.series}/> : null}
                {this.state.creators.length > 0 ? <Segment label='Creators' results = {this.state.creators}/> : null}
            </div>
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
        // if (this.state.term !== '' && this.state.comics.length > 0) {
        //     return (
        //         <div className="ui vertical stripe segment">
        //             <div className="ui container">
        //                 <span className="ui header">{this.state.filter.length} results for {this.state.term}</span>
        //                 <div className="ui container">
        //                     <ImageGrid title='Comics' results={this.state.filter} />
        //                 </div>
        //             </div>
        //         </div>
        );
    }

    //loading(message) {
    //    if (this.state.loading)
    //        return <Loader message={message} />;
    //}

    // TODO: add graphics on the side of the masthead
    // TODO: add api, github repo, linked in and contact as banner
    render() {
        return (
            <div>
                <div className='pusher'>
                    <div className='ui inverted vertical masthead center aligned segment'>
                        <div className="ui inverted compact labeled menu">
                            <a className="item" href="https://www.linkedin.com/in/jo-chong-a513963a/"><i className="icon link linkedin large"></i>LinkedIn</a>
                            <a className="item" href="https://github.com/ThankYouJim/mahvel"><i className="icon link github large"></i>Source</a>
                        </div>
                        <div className='ui text container'>
                            <h1 className='ui inverted header'><span className='marvel-text'>Marvel</span> Comic Viewer</h1>
                            <SearchBar onSubmit={this.loadResponse} />
                        </div>
                    </div>
                    {this.renderContent()}
                </div>
            </div>
        );
    }
}

export default App;
