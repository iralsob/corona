"use strict";

function getData() {
  let url = 'https://bretonium.net/countries.json';
  return fetch(url);
}

class CountiesTable extends React.Component {
  constructor(props) {
    super(props);
    this.handleScrollTable = this.handleScrollTable.bind(this);
    this.state = {
      currScrollPosition: 0,
      reachEndScrollPosition: false,
      error: 0,
      isLoaded: false,
      countries: {}
    };
  }

  componentDidMount() {
    getData().then(res => res.json()).then(result => {
      this.setState({
        isLoaded: true,
        countries: result
      });
    }, error => {
      this.setState({
        isLoaded: true,
        error: error
      });
    });
  }

  handleScrollTable(e) {
    var elm = e.target;
    this.setState({
      currScrollPosition: elm.scrollLeft
    });
    var endScrollPosition = elm.scrollWidth - elm.offsetWidth - 10;

    if (elm.scrollLeft >= endScrollPosition) {
      this.setState({
        reachEndScrollPosition: true
      });
    } else {
      this.setState({
        reachEndScrollPosition: false
      });
    }
  }

  getRowClass(name, displayName) {
    var className = 'countries-table__row country';

    if (name != displayName) {
      className += ' record';
    }

    return className;
  }

  getCountryClassName() {
    var className = "country__name";

    if (this.state.currScrollPosition > 0) {
      className += ' active';
    }

    return className;
  }

  getCountyName(countryName) {
    if (countryName == 'United_States_of_America') {
      countryName = 'USA';
    }

    return countryName;
  }

  getCountryRange(estimatedFrom, estimatedTo) {
    var range = estimatedFrom + ' - ' + estimatedTo;
    return range;
  }

  getCompareClass(estimatedFrom, estimatedTo, incidence) {
    var className = 'country__compared';

    if (incidence < estimatedFrom) {
      var difference = (estimatedFrom * 100 / incidence - 100).toFixed();

      if (difference >= 100) {
        className += ' more';
      }
    }

    return className;
  }

  getCompareContent(estimatedFrom, estimatedTo, incidence) {
    var content;

    if (incidence < estimatedFrom) {
      content = (estimatedFrom * 100 / incidence - 100).toFixed();
      content += '%';
    } else if (incidence > estimatedTo) {
      content = (estimatedTo * 100 / incidence - 100).toFixed();
      content += '%';
    } else {
      content = 'within range';
    }

    return content;
  }

  getOverflowClassName() {
    var overflowClassName = 'countries-table__overflow';

    if (!this.state.reachEndScrollPosition) {
      overflowClassName += ' active';
    }

    return overflowClassName;
  }

  getCountriesRows(countries) {
    var countriesRows = countries.map(country => /*#__PURE__*/React.createElement("tr", {
      key: country.country_data.position,
      className: this.getRowClass(country.country_data.country_name, country.country_data.display_name)
    }, /*#__PURE__*/React.createElement("td", {
      className: this.getCountryClassName()
    }, this.getCountyName(country.country_data.country_name)), /*#__PURE__*/React.createElement("td", {
      className: "country__cases"
    }, country.country_data.incidence_today), /*#__PURE__*/React.createElement("td", {
      className: "country__cases-week-ago"
    }, country.country_data.incidence_7_days_ago), /*#__PURE__*/React.createElement("td", {
      className: "country__cases-two-weeks-ago"
    }, country.country_data.incidence_13_days_ago), /*#__PURE__*/React.createElement("td", {
      className: "country__range"
    }, this.getCountryRange(country.country_data.estimated_from, country.country_data.estimated_to)), /*#__PURE__*/React.createElement("td", {
      className: this.getCompareClass(country.country_data.estimated_from, country.country_data.estimated_to, country.country_data.incidence_13_days_ago)
    }, this.getCompareContent(country.country_data.estimated_from, country.country_data.estimated_to, country.country_data.incidence_13_days_ago)), /*#__PURE__*/React.createElement("td", {
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
    const error = this.state.error,
          isLoaded = this.state.isLoaded,
          data = this.state.countries;

    if (error) {
      return /*#__PURE__*/React.createElement("div", null, "Error: ", error);
    } else if (!isLoaded) {
      return /*#__PURE__*/React.createElement("div", null, "Loading...");
    } else {
      var sortedCountries = data.sorted_countries;
      var hCountryClassName = '';

      if (this.state.currScrollPosition != 0) {
        hCountryClassName += 'active';
      }

      return /*#__PURE__*/React.createElement("div", {
        className: "countries-table__wrapper"
      }, /*#__PURE__*/React.createElement("div", {
        className: "countries-table__wrap",
        onScroll: this.handleScrollTable
      }, /*#__PURE__*/React.createElement("table", {
        className: "countries-table"
      }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
        className: hCountryClassName
      }, "Country"), /*#__PURE__*/React.createElement("th", null, "C"), /*#__PURE__*/React.createElement("th", null, "C week ago"), /*#__PURE__*/React.createElement("th", null, "C 13\xA0days ago"), /*#__PURE__*/React.createElement("th", null, "C", /*#__PURE__*/React.createElement("sub", null, "e"), " range"), /*#__PURE__*/React.createElement("th", null, "C", /*#__PURE__*/React.createElement("sub", null, "e"), " vs C 13\xA0days ago"), /*#__PURE__*/React.createElement("th", null, "D"), /*#__PURE__*/React.createElement("th", null, "D max"), /*#__PURE__*/React.createElement("th", null, "Weekly dynamics"), /*#__PURE__*/React.createElement("th", null, "Update"))), /*#__PURE__*/React.createElement("tbody", null, this.getCountriesRows(sortedCountries))), /*#__PURE__*/React.createElement("div", {
        className: this.getOverflowClassName()
      })));
    }
  }

}

class Content extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "C \u2013 corona-cases per 100,000 people per last week"), /*#__PURE__*/React.createElement("p", null, "C", /*#__PURE__*/React.createElement("sub", null, "e"), " \u2013 estimated C (\u0441alculated by deaths in 13 days if the lethality of the virus is 0.5% or 1%)"), /*#__PURE__*/React.createElement("p", null, "D \u2013 death per 100,000 people per last week"), /*#__PURE__*/React.createElement("p", null, "Countries with a record this week are highlighted in red."), /*#__PURE__*/React.createElement("p", null, "Cells in column C vs C", /*#__PURE__*/React.createElement("sub", null, "e"), " are highlighted in red, if\xA0C", /*#__PURE__*/React.createElement("sub", null, "e"), "\xA0is\xA0100%\xA0more")), /*#__PURE__*/React.createElement(CountiesTable, null));
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