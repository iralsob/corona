"use strict";

function getData() {
  let url = 'https://bretonium.net/countries.json';
  return fetch(url);
}

class CountriesTable extends React.Component {
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

  getRowClassName(name, displayName) {
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

  getRegionClassName() {
    var className = '';

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

  getRegionName(regionName) {
    if (regionName == 'Yamalo-Nenets Autonomous Okrug') {
      regionName = 'YaNAO';
    }

    return regionName;
  }

  getCountryRange(estimatedFrom, estimatedTo) {
    var range = estimatedFrom + ' - ' + estimatedTo;
    return range;
  }

  getRegionRange(rangeFrom, rangeTo) {
    var rangeContent = '-';

    if (rangeFrom) {
      rangeContent = rangeFrom + ' - ' + rangeTo;
    }

    return rangeContent;
  }

  getCompareClassName(estimatedFrom, estimatedTo, incidence) {
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
      content = '+' + (estimatedFrom * 100 / incidence - 100).toFixed();
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

  getCountriesSubRows(regions) {
    var regions = /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "1"));
    return regions;
  }

  getCountriesRows(countries) {
    var countriesRows = countries.map(function (countryData) {
      var country = countryData.country_data;
      var countryRow = /*#__PURE__*/React.createElement("tr", {
        key: country.position,
        className: this.getRowClassName(country.country_name, country.display_name)
      }, /*#__PURE__*/React.createElement("td", {
        className: this.getCountryClassName()
      }, this.getCountyName(country.country_name)), /*#__PURE__*/React.createElement("td", {
        className: "country__cases"
      }, country.incidence_today), /*#__PURE__*/React.createElement("td", {
        className: "country__cases-week-ago"
      }, country.incidence_7_days_ago), /*#__PURE__*/React.createElement("td", {
        className: "country__cases-two-weeks-ago"
      }, country.incidence_13_days_ago), /*#__PURE__*/React.createElement("td", {
        className: "country__range"
      }, this.getCountryRange(country.estimated_from, country.estimated_to)), /*#__PURE__*/React.createElement("td", {
        className: this.getCompareClassName(country.estimated_from, country.estimated_to, country.incidence_13_days_ago)
      }, this.getCompareContent(country.estimated_from, country.estimated_to, country.incidence_13_days_ago)), /*#__PURE__*/React.createElement("td", {
        className: "country__death"
      }, country.death_incidence_today.toFixed(2)), /*#__PURE__*/React.createElement("td", {
        className: "country__death-max"
      }, country.record_death_incidence.toFixed(2)), /*#__PURE__*/React.createElement("td", {
        className: "country__dynamic"
      }, country.direction_symbols), /*#__PURE__*/React.createElement("td", {
        className: "country__update"
      }, country.last_update_date));
      var regions = countryData.regions;

      if (regions.length) {
        var regionRows = regions.map(region => /*#__PURE__*/React.createElement("tr", {
          key: region.region_data.region_name,
          className: "country__region"
        }, /*#__PURE__*/React.createElement("td", {
          className: this.getRegionClassName()
        }, this.getRegionName(region.region_data.region_name)), /*#__PURE__*/React.createElement("td", null, region.region_data.incidence_today), /*#__PURE__*/React.createElement("td", null, region.region_data.incidence_7_days_ago > 0 ? region.region_data.incidence_7_days_ago : '-'), /*#__PURE__*/React.createElement("td", null, region.region_data.incidence_13_days_ago > 0 ? region.region_data.incidence_13_days_ago : '-'), /*#__PURE__*/React.createElement("td", null, this.getRegionRange(region.region_data.estimated_from, region.region_data.estimated_t)), /*#__PURE__*/React.createElement("td", {
          className: "country__region_compared"
        }, "-"), /*#__PURE__*/React.createElement("td", null, "-"), /*#__PURE__*/React.createElement("td", null, "-"), /*#__PURE__*/React.createElement("td", null, "-"), /*#__PURE__*/React.createElement("td", null, region.region_data.last_update_date)));
      }

      return [countryRow, regionRows];
    }.bind(this));
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
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "C \u2013 corona-cases per 100,000 people per last week"), /*#__PURE__*/React.createElement("p", null, "C", /*#__PURE__*/React.createElement("sub", null, "e"), " \u2013 estimated C (\u0441alculated by deaths in 13 days if the lethality of the virus is 0.5% or 1%)"), /*#__PURE__*/React.createElement("p", null, "D \u2013 death per 100,000 people per last week"), /*#__PURE__*/React.createElement("p", null, "Countries with a record this week are highlighted in red."), /*#__PURE__*/React.createElement("p", null, "Cells in column C vs C", /*#__PURE__*/React.createElement("sub", null, "e"), " are highlighted in red, if\xA0C", /*#__PURE__*/React.createElement("sub", null, "e"), "\xA0is\xA0100%\xA0more")), /*#__PURE__*/React.createElement(CountriesTable, null));
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