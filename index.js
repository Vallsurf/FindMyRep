const CIVIC_SEARCH_URL = 'https://www.googleapis.com/civicinfo/v2/representatives';
const GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
let divisons;
let office;
let officials;
let dataobject;
let lat;
let longi;

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    currentquery = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, parseobject);

    $('.results').html(`${query}`);
    $('.results').prop('hidden', false);
    $('.js-search-results').html('');

  });
}

function locateButtonClick() {
  $('.locate').on('click', function(event) {
    event.preventDefault();
    getCoords();
  });
}

function getDataFromApi(searchTerm, callback) {
  const query = {
    address: `${searchTerm}`,
    key: "AIzaSyCD8I3_yEbiRrdX_G1sTrMP3MrxwPk-nTA",
  }


  $.ajax({
      url: CIVIC_SEARCH_URL,
      data: query,
      method: 'GET',
    })

    .then(function(response) {
      console.log(response);
      parseobject(response);
    })

    .catch(function(error) {
      console.log(error);
      $('.js-search-results').html('<h1>Your search did not work, please try again.</h1>');
    });

}

function parseobject(data) {
  console.log(data);
  office = data.offices;
  officials = data.officials;
  const results = data.offices.slice(2).map((item, index) => renderResult(item));
}

function renderResult(result) {
  const officialsobject = result.officialIndices.map((item, index) => officials[item]);
  console.log(officialsobject.length);


  for (var i = 0; i < officialsobject.length; i++) {
    console.log(officialsobject.length);
    $('.js-search-results').append(`    
      <div class ="col-md-4">
      <div class ="result" aria-label="result">
      <h3 aria-label="Office">${result.name}</h3>
      <h4 aria-labelledby="Name">${officialsobject[i].name}</h4>
      ${officialsobject[i].party ? `<p aria-labelledby="Party">${officialsobject[i].party}</p>` : '' }
      ${officialsobject[i].phones ? `<p aria-labelledby="Phone Number">${officialsobject[i].phones}</p>` : '' }
      ${officialsobject[i].emails ? `<p aria-labelledby="Email">${officialsobject[i].emails}</p>` : '' }
      ${officialsobject[i].urls ? `<a aria-labelledby="Website" href="${officialsobject[i].urls}">${officialsobject[i].urls}</a>` : ``} 
     </div>
</div>
`);
  }
}



function getCoords() {
  $.ajax({
      url: 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCD8I3_yEbiRrdX_G1sTrMP3MrxwPk-nTA',
      method: 'post',
    })
    .then(function(response) {
      console.log(response);
      lat = response.location.lat;
      longi = response.location.lng;
      console.log(lat, longi);
      getAddress(lat, longi, getDataFromApi);


    })
    .catch(function(error) {
      console.log(error);
      $('.js-search-results').html('<h1>Your search did not work, please try again.</h1>');

    });
}

function getAddress(Latitude, Longitude, callback) {
  const query = {
    latlng: `${Latitude},${Longitude}`,
    key: "AIzaSyCD8I3_yEbiRrdX_G1sTrMP3MrxwPk-nTA",

  }
  $.getJSON(GEOCODE_URL, query, addressSuccess);

}

function addressSuccess(data) {
  let thisobj = data.results[0].formatted_address;
  console.log(thisobj);
  $('.results').html(data.results[1].formatted_address);
  $('.results').prop('hidden', false);
  $('.js-search-results').html('');
  getDataFromApi(thisobj, parseobject);

}

$(watchSubmit);
$(locateButtonClick);