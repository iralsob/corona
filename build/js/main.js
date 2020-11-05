"use strict";

function getData() {
  let url = 'https://irisob.github.io/corona/build/data/data.json';
  return fetch(url);
}

function handleScroll(e) {
  var elm = e.target;
  var scrollPosition = elm.scrollLeft;
  var endScrollPosition = elm.scrollWidth - elm.offsetWidth - 10;
  var fcElements = document.getElementsByClassName("js-toggle-shadow-fc");
  var wElements = document.getElementsByClassName("js-toggle-shadow-w");

  if (scrollPosition == 0) {
    for (var i = 0; i < fcElements.length; i++) {
      fcElements[i].classList.remove('active');
    }
  } else {
    for (var i = 0; i < fcElements.length; i++) {
      fcElements[i].classList.add('active');
    }
  }

  if (scrollPosition >= endScrollPosition) {
    for (var i = 0; i < wElements.length; i++) {
      wElements[i].classList.remove('active');
    }
  } else {
    for (var i = 0; i < wElements.length; i++) {
      wElements[i].classList.add('active');
    }
  }
}

function createCountriesTable(data) {
  var countriesTable = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "C \u2013 corona-cases per 100,000 people per last week"), /*#__PURE__*/React.createElement("p", null, "C", /*#__PURE__*/React.createElement("sub", null, "e"), " \u2013 emulated C (\u0441alculated by deaths in 7 days if the lethality of the virus is 0.5% or 1%)"), /*#__PURE__*/React.createElement("p", null, "D \u2013 death per 100,000 people per last week"), /*#__PURE__*/React.createElement("p", null, "Countries with a record this week are highlighted in red")), /*#__PURE__*/React.createElement("div", {
    className: "countries-table__wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "countries-table__wrap",
    onScroll: handleScroll
  }, /*#__PURE__*/React.createElement("table", {
    className: "countries-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "js-toggle-shadow-fc"
  }, "Country"), /*#__PURE__*/React.createElement("th", null, "C"), /*#__PURE__*/React.createElement("th", null, "C week ago"), /*#__PURE__*/React.createElement("th", null, "C 2\xA0weeks ago"), /*#__PURE__*/React.createElement("th", null, "C", /*#__PURE__*/React.createElement("sub", null, "e"), " range"), /*#__PURE__*/React.createElement("th", null, "C", /*#__PURE__*/React.createElement("sub", null, "e"), " vs C 2\xA0weeks ago"), /*#__PURE__*/React.createElement("th", null, "D"), /*#__PURE__*/React.createElement("th", null, "D max"), /*#__PURE__*/React.createElement("th", null, "Weekly dynamics"))), /*#__PURE__*/React.createElement("tbody", null, createCountryRows(data))), /*#__PURE__*/React.createElement("div", {
    className: "countries-table__overflow js-toggle-shadow-w active"
  }))));
  return countriesTable;
}

function createCountryRows(data) {
  var sortedCountries = data.sorted_countries;
  var countriesRows = sortedCountries.map(country => /*#__PURE__*/React.createElement("tr", {
    key: country.country_data.position,
    className: country.country_data.country_name == country.country_data.display_name ? 'countries-table__row country' : 'countries-table__row country record'
  }, /*#__PURE__*/React.createElement("td", {
    className: "country__name js-toggle-shadow-fc"
  }, country.country_data.country_name), /*#__PURE__*/React.createElement("td", {
    className: "country__cases"
  }, country.country_data.incidence_today), /*#__PURE__*/React.createElement("td", {
    className: "country__cases-week-ago"
  }, country.country_data.incidence_7_days_ago), /*#__PURE__*/React.createElement("td", {
    className: "country__cases-two-weeks-ago"
  }, country.country_data.incidence_13_days_ago), /*#__PURE__*/React.createElement("td", {
    className: "country__range"
  }, country.country_data.estimated_from, "-", country.country_data.estimated_to), /*#__PURE__*/React.createElement("td", {
    className: country.country_data.estimation_match_symbol == "<" ? 'country__compared more' : 'country__compared'
  }, "C ", country.country_data.estimation_match_symbol, " C", /*#__PURE__*/React.createElement("sub", null, "e")), /*#__PURE__*/React.createElement("td", {
    className: "country__death"
  }, country.country_data.death_incidence_today.toFixed(2)), /*#__PURE__*/React.createElement("td", {
    className: "country__death-max"
  }, country.country_data.record_death_incidence.toFixed(2)), /*#__PURE__*/React.createElement("td", {
    className: "country__dynamic"
  }, country.country_data.direction_symbols)));
  return countriesRows;
}

function getContent() {
  return getData().then(function (response) {
    if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' + response.status);
      return;
    }

    let countries_table = response.json().then(function (data) {
      return createCountriesTable(data);
    });
    return countries_table;
  }).catch(function (err) {
    console.log('Fetch Error :-S', err);
  });
}

function App() {
  return getContent().then(content => {
    return /*#__PURE__*/React.createElement("div", {
      className: "container"
    }, content);
  });
}

;
App().then(app => {
  ReactDOM.render(app, document.querySelector("#main"));
});