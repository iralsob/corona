"use strict";

function getData() {
  let url = 'https://irisob.github.io/corona/build/data/data.json';
  return fetch(url);
}

function createCountriesTable(data) {
  var countriesTable = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "N \u2013 corona-cases per 100,000 people per week"), /*#__PURE__*/React.createElement("p", null, "N", /*#__PURE__*/React.createElement("sub", null, "e"), " range \u2013 emulated N (\u0441alculated by deaths in 7 days if the lethality of the virus is 0.5% or 1%)"), /*#__PURE__*/React.createElement("p", null, "Countries with a record this week are highlighted in red")), /*#__PURE__*/React.createElement("div", {
    className: "countries-table_wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "countries-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Country"), /*#__PURE__*/React.createElement("th", null, "N"), /*#__PURE__*/React.createElement("th", null, "N week ago"), /*#__PURE__*/React.createElement("th", null, "N 2 weeks ago"), /*#__PURE__*/React.createElement("th", null, "N", /*#__PURE__*/React.createElement("sub", null, "e"), " range"), /*#__PURE__*/React.createElement("th", null, "Compared to last week"), /*#__PURE__*/React.createElement("th", null, "Weekly dynamics"))), /*#__PURE__*/React.createElement("tbody", null, createCountryRows(data)))));
  return countriesTable;
}

function createCountryRows(data) {
  var countriesRows = data.map(country => /*#__PURE__*/React.createElement("tr", {
    key: country.id,
    className: country.is_this_week_record ? 'countries-table__row country record' : 'countries-table__row country'
  }, /*#__PURE__*/React.createElement("td", {
    className: "country_name"
  }, country.country_name), /*#__PURE__*/React.createElement("td", {
    className: "country_cases"
  }, country.cases_per_ht), /*#__PURE__*/React.createElement("td", {
    className: "country_cases-week-ago"
  }, country.cases_per_ht_week_ago), /*#__PURE__*/React.createElement("td", {
    className: "country_cases-two-weeks-ago"
  }, country.cases_per_ht_two_week_ago), /*#__PURE__*/React.createElement("td", {
    className: "country_range"
  }, country.es_from, "-", country.es_to), /*#__PURE__*/React.createElement("td", {
    className: country.estimation_match_symbol == ">" ? 'country_compared more' : 'country_compared'
  }, country.estimation_match_symbol), /*#__PURE__*/React.createElement("td", {
    className: "country_dynamic"
  }, country.direction)));
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