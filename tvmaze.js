"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let response = await axios.get('http://api.tvmaze.com/search/shows', { params: { q: term } })
  //let showObjects = response.data.map(function(showData) {console.log(showData.show.name, showData.show.summary) })
  //console.log(response.data)

  //rename showData
  let showObjects = response.data.map(function (showData) {
    let img;
    if( showData.show.image === null ) {
      img = 'corgi.jpeg'
    } else {
      img = showData.show.image.medium
    }

      return {
        id: showData.show.id,
        name: showData.show.name,
        summary: showData.show.summary,
        image: img

      }
  })
  console.log(showObjects)
  return showObjects;


  //let meow = response.data.map(function(showData) {console.log(showData.show.name) })
  //  map
  //console.log(response.data.map(pick(response.data,['show.id','show.name','show.summary','show.image.medium'])))
  //return response.data.map(pick(response.data,['show.id','show.name','show.summary','show.image.medium']));
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="${show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
  $('.Show-getEpisodes').on('click', async function (evt) {
    console.log('clicked');
    evt.preventDefault();
    console.log(evt.target);
    await getEpisodesOfShow($(evt.target).closest('data-show-id').data('data-show-id'));
    populateEpisodes;
  })
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  response.data.map(function(episodeData){
    return {
      id: episodeData.id,
      name: episodeData.name,
      season: episodeData.season,
      number: episodeData.number,
    }
  })
 }

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { 
  for(let episode of episodes){
    $('#episodesList').append(`<li>${episode.name} (season ${episode.season}, number ${episode.number} </li>`)
}
}

function episodesClick(){
  $episodesArea.show();
}


// $('.Show-getEpisodes').on('click', function (evt) {
//   evt.preventDefault();
//   console.log('clicked')});
