import React from 'react';
import axios from 'axios';
import marvel from '../api/marvel';
import MenuBar from './MenuBar';
import SearchBar from './SearchBar';
import Loader from './Loader';
import Segment from './Segment';

// q: query, list: an array type
// credit: https://www.peterbe.com/plog/a-darn-good-search-filter-function-in-javascript
// function filterList(q, list) {
//   function escapeRegExp(s) {
//     return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
//   }
//   const words = q
//     .split(/\s+/g)
//     .map(s => s.trim())
//     .filter(s => !!s);
//   const hasTrailingSpace = q.endsWith(' ');
//   const searchRegex = new RegExp(
//     words
//     .map((word, i) => {
//       if (i + 1 === words.length && !hasTrailingSpace) {
//         // The last word - ok with the word being 'startswith'-like
//         return `(?=.*\\b${escapeRegExp(word)})`;
//       } else {
//         // Not the last word - expect the whole word exactly
//         return `(?=.*\\b${escapeRegExp(word)}\\b)`;
//       }
//     })
//     .join('') + '.+',
//     'gi'
//   );
//   return list.filter(item => {
//     return searchRegex.test(item.title);
//   });
// }

class App extends React.Component {
  state = {
    loading: false,
    hasContent: false,
    /* should be like this
      cache:['spider': {
        characters: [{...}],
        series: [{...}],
        ...
      }]
    */
    cache: [], 
    series: [],
    characters: [],
    creators: [],
    events: [],
    comics: [],
    term: '',
    // activeIndex: 0
  };

  componentDidMount() {
  }

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
  loadResponse = async (form = { term: '', tags: [] }) => {
    if (form.term !== '') {
      console.log('Searching', form.term, form.tags);
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

      // .results of series, characters, events has descriptions

      this.setState({ loading: true }, () => {
        axios.all([series, characters, creators, events], { timeout: 5000 })
          .then(axios.spread((...responses) => {
            const series = responses[0].data.data;
            const characters = responses[1].data.data;
            const creators = responses[2].data.data;
            const events = responses[3].data.data;
            console.log(series);
            console.log(characters);
            console.log(creators);
            console.log(events);
            // console.log(comics);

            this.setState({
              loading: false,
              hasContent: 
                (series.total > 0 || characters.total > 0 || creators.total > 0 || events.total > 0 ? true : false),
              series,
              characters,
              creators,
              events
            });
          }))
          .catch(e => {
            if (e.code === 'ECONNABORTED')
              console.log('Search timeout. Try again?');
            else
              console.log(e);
          })
          .then(() => {
            if (!this.state.hasContent) {
              console.log('No results');
              this.setState({
                series: [],
                characters:[],
                creators: [],
                events: []
              })
            }
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

  // handleClick = (e, titleProps) => {
  //     const { index } = titleProps;
  //     const { activeIndex } = this.state;
  //     const newIndex = activeIndex === index ? -1 : index;

  //     this.setState({ activeIndex: newIndex });
  // }

  renderMainContent() {
    // const test = [{id:1, thumbnail: {path:'abc', extension:'.jpg'}, label:'A-man'}];
    // const { activeIndex } = this.state

    return (
      <div className='ui container content'>
        {this.state.loading ? <Loader message={this.state.term} /> : null}
        {this.state.characters.results ?
          <Segment label='Characters' results = {this.state.characters.results}/> : null}
        {this.state.series.results ? 
          <Segment label='Series' results = {this.state.series.results}/> : null}
        {this.state.events.results ? 
          <Segment label='Events' results = {this.state.events.results}/> : null}
        {this.state.creators.results ? 
          <Segment label='Creators' results = {this.state.creators.results}/> : null}
      </div>
    );
  }

  // TODO: add graphics on the side of the masthead
  render() {
    return (
      <div className='pusher'>

        <div className='ui inverted vertical masthead center aligned segment banner'>
          <MenuBar />
          <div className='ui text container mastpad'>
            <h1 className='ui inverted header'>
              <span className='marvel-text'>Marvel</span> Comic Viewer
            </h1>
            <SearchBar onSubmit={this.loadResponse} />
          </div>
        </div>

        {this.renderMainContent()}
        
        {/* Footer with links */}
        <footer className='ui footer inverted vertical center aligned segment'>
          <div className='ui inverted divided grid'>
            <div className='two column row'>
              <div className='column'>
                <h4 className='ui inverted header'>
                  Made using <a href='https://developer.marvel.com/'>Marvel API</a>
                </h4>
              </div>
              <div className='column'>
                <h4 className='ui inverted header'>Contact Me</h4>
                <div className='ui inverted link list' role='list'>
                  <a className='item' role='listitem' href='https://www.linkedin.com/in/jo-chong-a513963a'>LinkedIn</a>
                  <a className='item' role='listitem' href='https://github.com/ThankYouJim'>Github</a>
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