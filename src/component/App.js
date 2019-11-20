import React from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
// import ImageGrid from './ImageGrid';
import marvel from '../api/marvel';
import Loader from './Loader';
import Segment from './Segment';


// q: query, list: an array type
// credit: https://www.peterbe.com/plog/a-darn-good-search-filter-function-in-javascript
function filterList(q, list) {
    function escapeRegExp(s) {
        return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    const words = q
        .split(/\s+/g)
        .map(s => s.trim())
        .filter(s => !!s);
    const hasTrailingSpace = q.endsWith(' ');
    const searchRegex = new RegExp(
        words
            .map((word, i) => {
                if (i + 1 === words.length && !hasTrailingSpace) {
                    // The last word - ok with the word being 'startswith'-like
                    return `(?=.*\\b${escapeRegExp(word)})`;
                } else {
                    // Not the last word - expect the whole word exactly
                    return `(?=.*\\b${escapeRegExp(word)}\\b)`;
                }
            })
            .join('') + '.+',
        'gi'
    );
    return list.filter(item => {
        return searchRegex.test(item.title);
    });
}

class App extends React.Component {
    state = {
        loading: false,
        hasContent: false,
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
    loadResponse = async (form = { term: '' }) => {
        if (form.term !== '') {
            console.log('Searching', form.term);
            const series = marvel.get('/series', {
                params: {
                    titleStartsWith: form.term
                }
            });
            const characters = marvel.get('/characters', {
                params: {
                    nameStartsWith: form.term
                }
            });
            const creators = marvel.get('/creators', {
                params: {
                    nameStartsWith: form.term
                }
            });
            const events = marvel.get('/events', {
                params: {
                    nameStartsWith: form.term
                }
            });
            // const comics = await marvel.get('/comics', {
            //     params: {
            //         titleStartsWith: term
            //     }
            // });

            this.setState({ loading: true }, () => {
                axios.all([series, characters, creators, events])
                .then(axios.spread((...responses) => {
                    const series = responses[0].data.data;
                    const characters = responses[1].data.data;
                    const creators = responses[2].data.data;
                    const events = responses[3].data.data;
                    console.log(series);
                    console.log(characters);
                    console.log(creators);
                    console.log(series);
                    // console.log(comics);

                    this.setState({
                        loading: false,
                        hasContent: (series.total > 0 || characters.total > 0 || creators.total > 0 || events.total > 0 ? true : false),
                        series,
                        characters,
                        creators,
                        events
                    });
                }))
                .catch(e => {
                    console.log('Error:', e);
                })
                .then(()=>{
                    if (!this.state.hasContent)
                        console.log('No results');
                });
            });
        }

    }

    // handlePageClick = data => {
    //     let selected = data.selected;
    //     let offset = Math.ceil(selected * this.state.limit);

    //     this.setState({ offset }, () => {
    //         // this.loadResponse();
    //     });
    // }

    renderContent() {
        // const test = [{id:1, thumbnail: {path:'abc', extension:'.jpg'}, label:'A-man'}];
        return (
            <div className='ui container'>
                {this.state.loading ? <Loader message={this.state.term} /> : null}
                {this.state.characters.length > 0 ? <Segment label='Characters' results = {this.state.characters}/> : null}
                {this.state.series.length > 0 ? <Segment label='Series' results = {this.state.series}/> : null}
                {this.state.events.length > 0 ? <Segment label='Events' results = {this.state.events}/> : null}
                {this.state.creators.length > 0 ? <Segment label='Creators' results = {this.state.creators}/> : null}
            </div>
        );
    }

    // TODO: add graphics on the side of the masthead
    render() {
        return (
            /*main warapper*/
            <div className='pusher'>
                {/* The head of the page. Bug: It's not reading masthead so it's squashed */}
                <div className='ui inverted vertical masthead center aligned segment banner'>
                    {/* menu */}
                    <div className='ui container'>
                        <div className='ui inverted compact labeled menu'>
                            <a className='item' href='https://www.linkedin.com/in/jo-chong-a513963a/'><i className='icon link linkedin large'></i>LinkedIn</a>
                            <a className='item' href='https://github.com/ThankYouJim/mahvel'><i className='icon link github large'></i>Source</a>
                        </div>
                    </div>
                    {/* Texts and searchbar */}
                    <div className='ui text container mastpad'>
                        <h1 className='ui inverted header'>
                            <span className='marvel-text'>Marvel</span> Comic Viewer
                        </h1>
                        <SearchBar onSubmit={this.loadResponse} onClick={this.loading} />
                    </div>
                </div>

                {/* Main Content  */}
                {this.renderContent()}
  
                {/* Footer with links */}
                <footer className='ui footer inverted vertical center aligned segment'>
                    <div className='ui container'>
                      <div className='ui inverted divided grid'>
                        <div className='two column row'>
                          <div className='column'>
                            <h4 className='ui inverted header'>Made using <a href='https://developer.marvel.com/'>Marvel API</a></h4>
                          </div>
                          <div className='column'>
                            <h4 className='ui inverted header'>Contact Me</h4>
                            <div className='ui inverted link list' role='list'>
                              <a className='item' role='listitem' herf='https://www.linkedin.com/in/jo-chong-a513963a'>LinkedIn</a>
                              <a className='item' role='listitem' herf='https://github.com/ThankYouJim'>Github</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </footer>
            </div>
        );
    }
}

export default App;
