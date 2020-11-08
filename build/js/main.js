"use strict";

function getData() {
  const Http = new XMLHttpRequest();
  const url = 'https://bretonium.net/countries.json';
  Http.open("GET", url, false);
  Http.send();
  return Http.responseText;
}

class CountiesTable extends React.Component {
  getCountriesRows(countries) {
    var countriesRows = countries.map(country => /*#__PURE__*/React.createElement("tr", {
      key: country.country_data.position,
      className: country.country_data.country_name == country.country_data.display_name ? 'countries-table__row country' : 'countries-table__row country record'
    }, /*#__PURE__*/React.createElement("td", {
      className: "country__name js-toggle-shadow-fc"
    }, country.country_data.country_name == 'United_States_of_America' ? 'USA' : country.country_data.country_name), /*#__PURE__*/React.createElement("td", {
      className: "country__cases"
    }, country.country_data.incidence_today), /*#__PURE__*/React.createElement("td", {
      className: "country__cases-week-ago"
    }, country.country_data.incidence_7_days_ago), /*#__PURE__*/React.createElement("td", {
      className: "country__cases-two-weeks-ago"
    }, country.country_data.incidence_13_days_ago), /*#__PURE__*/React.createElement("td", {
      className: "country__range"
    }, country.country_data.estimated_from, "-", country.country_data.estimated_to), /*#__PURE__*/React.createElement("td", {
      className: country.country_data.estimation_match_symbol == "<" ? 'country__compared more' : 'country__compared'
    }, (country.country_data.estimated_from * 100 / country.country_data.incidence_13_days_ago - 100).toFixed(), "%"), /*#__PURE__*/React.createElement("td", {
      className: "country__death"
    }, country.country_data.death_incidence_today.toFixed(2)), /*#__PURE__*/React.createElement("td", {
      className: "country__death-max"
    }, country.country_data.record_death_incidence.toFixed(2)), /*#__PURE__*/React.createElement("td", {
      className: "country__dynamic"
    }, country.country_data.direction_symbols), /*#__PURE__*/React.createElement("td", {
      className: "country__update"
    }, country.country_data.last_update_date)));
    return countriesRows;
  }

  render() {
    const data = JSON.parse(getData());
    var sortedCountries = data.sorted_countries;
    return /*#__PURE__*/React.createElement("div", {
      className: "countries-table__wrapper js-table"
    }, /*#__PURE__*/React.createElement("div", {
      className: "countries-table__wrap"
    }, /*#__PURE__*/React.createElement("table", {
      className: "countries-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      className: "js-toggle-shadow-fc"
    }, "Country"), /*#__PURE__*/React.createElement("th", null, "C"), /*#__PURE__*/React.createElement("th", null, "C week ago"), /*#__PURE__*/React.createElement("th", null, "C 13\xA0days ago"), /*#__PURE__*/React.createElement("th", null, "C", /*#__PURE__*/React.createElement("sub", null, "e"), " range"), /*#__PURE__*/React.createElement("th", null, "C", /*#__PURE__*/React.createElement("sub", null, "e"), " vs C 13\xA0days ago"), /*#__PURE__*/React.createElement("th", null, "D"), /*#__PURE__*/React.createElement("th", null, "D max"), /*#__PURE__*/React.createElement("th", null, "Weekly dynamics"), /*#__PURE__*/React.createElement("th", null, "Update"))), /*#__PURE__*/React.createElement("tbody", null, this.getCountriesRows(sortedCountries))), /*#__PURE__*/React.createElement("div", {
      className: "countries-table__overflow js-toggle-shadow-w active"
    })));
  }

}

class Content extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "C \u2013 corona-cases per 100,000 people per last week"), /*#__PURE__*/React.createElement("p", null, "C", /*#__PURE__*/React.createElement("sub", null, "e"), " \u2013 estimated C (\u0441alculated by deaths in 13 days if the lethality of the virus is 0.5% or 1%)"), /*#__PURE__*/React.createElement("p", null, "D \u2013 death per 100,000 people per last week"), /*#__PURE__*/React.createElement("p", null, "Countries with a record this week are highlighted in red")), /*#__PURE__*/React.createElement(CountiesTable, null));
  }

}

class App extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "container"
    }, /*#__PURE__*/React.createElement(Content, null));
  }

}

;
ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.querySelector("#main"));