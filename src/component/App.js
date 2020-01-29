import React from 'react';
import axios from 'axios';

import marvel from '../api/marvel';
import MenuBar from './MenuBar';
import SearchBar from './SearchBar';
import Loader from './Loader';
import Segment from './Segment';
import Footer from './Footer';

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
    cache: {}, 
    series: [],
    characters: [],
    creators: [],
    events: [],
    comics: [],
    term: '',
    tags: []
    // activeIndex: 0
  };

  /*
  .limit - the set limited number of returns (default 20)
  .total - resources available out of the limited set
  .count - totla number of result of this call
  .results - list of characters
  */
  loadResponse = async ( term = '' ) => {
    console.log('LOAD', term);
    if (term !== '') {
      if (term in this.state.cache)  {
        this.setState({
          term
        })
      }

      else {
        // console.log('Searching', form.term);
        const series = marvel.get('/series', {
          params: {
            titleStartsWith: term
          }
        });
        const characters = marvel.get('/characters', {
          params: {
            nameStartsWith: term
          }
        });
        const creators = marvel.get('/creators', {
          params: {
            nameStartsWith: term
          }
        });
        const events = marvel.get('/events', {
          params: {
            nameStartsWith: term
          }
        });
        // const comics = await marvel.get('/comics', {
        //     params: {
        //         titleStartsWith: term
        //     }
        // });

        // .results of series, characters, events has descriptions
        const startTime = (new Date()).getTime();
        this.setState({ loading: true }, () => {
          axios.all([series, characters, creators, events], { timeout: 5000 })
            .then(axios.spread((...responses) => {
              const series = responses[0].data.data;
              const characters = responses[1].data.data;
              const creators = responses[2].data.data;
              const events = responses[3].data.data;

              const makeCache = {
                [term]: 
                  {
                    characters,
                    creators,
                    series,
                    events
                }
              }

              this.setState({
                loading: false,
                hasContent: (
                  series.total > 0 
                  || characters.total > 0 
                  || creators.total > 0 
                  || events.total > 0 
                  ? true : false
                ),
                term,
                cache: {...this.state.cache, ...makeCache}
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
              }
              const endTime = (new Date()).getTime();
              console.log('Time taken:', (endTime - startTime)/1000, 's');
            });
        });
      }
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

  // renderMainContent() {
  //   // const { activeIndex } = this.state
  //   // const options = [
  //     // { key: 'all', text: 'All', value: 'all' },
  //   //   { key: 'characters', text: 'Characters', value: 'characters' },
  //   //   { key: 'series', text: 'Series', value: 'series' },
  //   //   { key: 'events', text: 'Events', value: 'events' },
  //   //   { key: 'creators', text: 'Creators', value: 'creators' },
  //   //   { key: 'comics', text: 'Comics', value: 'comics' }
  //   // ]

  //   const { loading, term, cache,characters, series, events, creators } = this.state; 
  //   console.log(loading);
  //   console.log('Main cache', cache);
  //   const currentCache = cache[term];
  //   console.log('Term:', term, currentCache);

  //   if (term === '') {
  //     return <div className='nothing-message'>Nothing here! Search something?</div>
  //   }
  //   else {
  //     return (
  //       <>

  //       <div className='ui container tags'>
  //         <Dropdown
  //           placeholder='Filter By:'
  //           multiple
  //           selection
  //           options={options}
  //           onChange={(e,data)=>{
  //             console.log(data.value);
  //             // setTags(data.value)
  //           }}
  //         />
  //       </div>
  //         {loading && <Loader message={term} />}
  //         {characters.results &&
  //           <Segment label='Characters' results = {this.state.characters.results}/>}
  //         {series.results &&
  //           <Segment label='Series' results = {this.state.series.results}/>}
  //         {events.results &&
  //           <Segment label='Events' results = {this.state.events.results}/>}
  //         {creators.results &&
  //           <Segment label='Creators' results = {this.state.creators.results}/>}
  //       </>
  //     )
  //   }
  // }

  // TODO: add graphics on the side of the masthead
  render() {
    const { loading, term, cache } = this.state;
    const loaded = cache[term];

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

        <div className='ui container content'>
          { loading && <Loader message={term} /> }
          { term === '' ?
            <div className='nothing-message'>Nothing here! Search something?</div> : 
            loaded.characters &&
              <Segment label='Characters' results = {loaded.characters.results}/>

          }
        </div>
        
        <Footer />

      </div>
    );
  }
}

export default App;