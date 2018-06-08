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
    $('.results').html(`Entered Address: ${query}`);
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

  //$.getJSON(CIVIC_SEARCH_URL, query, callback);

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


  // $('.js-search-results').html(results);
}

function renderResult(result) {
  //   const officialsname = result.officialIndices.map((item, index) => `${officials[item].name}`); 
  //   const officialsphone = result.officialIndices.map((item, index) => `${officials[item].phones}`); 
  //   const officialsparty = result.officialIndices.map((item, index) => `${officials[item].party}`); 
  const officialsobject = result.officialIndices.map((item, index) => officials[item]);
  console.log(officialsobject.length);


  for (var i = 0; i < officialsobject.length; i++) {
    console.log(officialsobject.length);
    $('.js-search-results').append(`    
      <div class ="col-md-4">
      <div class ="result">
      <h3>${result.name}</h3>
      <h4>${officialsobject[i].name}</h4>
      <p>${officialsobject[i].party}</p>
      <p>${officialsobject[i].phones}</p>
      ${officialsobject[i].emails ? `<p>${officialsobject[i].emails}</p>` : '' }
      ${officialsobject[i].urls ? `<a href="${officialsobject[i].urls}">${officialsobject[i].urls}</a>` : ``} 
     </div>
</div>
`);

    //   return `
    //     <div class ="result">
    //       <h2>${result.name}</h2>
    //       <h2>${officialsobject[i].name}</h2>
    //       <p>${officialsobject[i].party}</p>
    //       <p>${officialsobject[i].phones}</p>
    //     </div>
    //   `;
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
  $('.js-search-results').html('');
  getDataFromApi(thisobj, parseobject);

}

$(watchSubmit);
$(locateButtonClick);