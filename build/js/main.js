"use strict";

class CountriesTable extends React.Component {
  constructor(props) {
    super(props);
    this.handleScrollTable = this.handleScrollTable.bind(this);
    this.onSort = this.onSort.bind(this);
    this.toggleCountriesQuantity = this.toggleCountriesQuantity.bind(this);
    this.toggleRegionsView = this.toggleRegionsView.bind(this);
    this.state = {
      currScrollPosition: 0,
      reachEndScrollPosition: false,
      error: 0,
      isLoaded: false,
      countries: {},
      sortField: 'incidence_today',
      sort: 'asc',
      showAllWorld: false,
      hideRegions: true
    };
  }

  componentDidMount() {
    this.getData().then(response => response.json()).then(countries => {
      this.setState({
        isLoaded: true,
        countries
      });
    }, error => {
      this.setState({
        isLoaded: true,
        error
      });
    });
  }

  getData() {
    let url = 'https://bretonium.net/countries.json';
    return fetch(url);
  }

  handleScrollTable(e) {
    let elm = e.target;
    this.setState({
      currScrollPosition: elm.scrollLeft
    });
    const endScrollPosition = elm.scrollWidth - elm.offsetWidth - 10;

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

  onSort(sortField) {
    const cloneData = this.state.countries.sorted_countries;
    let sortType; // add column 'compare' for sort

    for (let i = 0; i < cloneData.length; i++) {
      let country = cloneData[i].country_data;

      if (country.incidence_13_days_ago == 0) {
        country['compare'] = Infinity;
      } else if (country.estimated_from == 0) {
        country['compare'] = -Infinity;
      } else {
        country['compare'] = country.estimated_from / country.incidence_13_days_ago;
      }

      cloneData[i].country_data = country;
    }

    if (sortField == this.state.sortField) {
      sortType = this.state.sort === 'asc' ? 'desc' : 'asc';
    } else {
      sortType = 'desc';
    }

    const orderedData = _.orderBy(cloneData, [function (o) {
      return o.country_data[sortField];
    }], sortType);

    this.setState({
      countries: {
        'sorted_countries': orderedData
      },
      sort: sortType,
      sortField: sortField
    });
  }

  getRowClassName(name, displayName) {
    let className = 'countries-table__row country';

    if (name != displayName) {
      className += ' record';
    }

    return className;
  }

  getCountryClassName() {
    let className = "country__name";

    if (this.state.currScrollPosition > 0) {
      className += ' active';
    }

    return className;
  }

  getRegionClassName() {
    let className = '';

    if (this.state.currScrollPosition > 0) {
      className += ' active';
    }

    return className;
  }

  getCountryName(countryName) {
    if (countryName == 'United_States_of_America') {
      countryName = 'USA';
    } else if (countryName == 'Democratic_Republic_of_the_Congo') {
      countryName = 'DR Congo';
    } else if (countryName == 'United_Republic_of_Tanzania') {
      countryName = 'Tanzania';
    } else if (countryName == 'Bosnia_and_Herzegovina') {
      countryName = 'BiH';
    } else if (countryName == 'Central_African_Republic') {
      countryName = 'CAR';
    } else if (countryName == 'United_Arab_Emirates') {
      countryName = 'UAE';
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
    let range = estimatedFrom + ' - ' + estimatedTo;
    return range;
  }

  getRegionRange(rangeFrom, rangeTo) {
    let rangeContent = '-';

    if (rangeFrom) {
      rangeContent = rangeFrom + ' - ' + rangeTo;
    }

    return rangeContent;
  }

  getCompareClassName(estimatedFrom, estimatedTo, incidence) {
    let className = 'country__compared';

    if (incidence < estimatedFrom && incidence > 0) {
      let difference = (estimatedFrom * 100 / incidence - 100).toFixed();

      if (difference >= 100) {
        className += ' more';
      }
    }

    return className;
  }

  getCompareContent(estimatedFrom, estimatedTo, incidence) {
    let content = '';

    if (incidence == 0) {
      content += ' ';
    } else if (incidence < estimatedFrom) {
      content += '+';
      content += (estimatedFrom * 100 / incidence - 100).toFixed();
      content += '%';
    } else if (incidence > estimatedTo) {
      content += (estimatedTo * 100 / incidence - 100).toFixed();
      content += '%';
    } else {
      content += 'within range';
    }

    return content;
  }

  getOverflowClassName() {
    let overflowClassName = 'countries-table__overflow';

    if (!this.state.reachEndScrollPosition) {
      overflowClassName += ' active';
    }

    return overflowClassName;
  }

  getIncidenceClassName(displayName) {
    let className = '';

    if (displayName.indexOf('!!') > -1) {
      className = 'more';
    }

    return className;
  }

  getSortIconClassName(sortField) {
    let className = 'sort__icon';

    if (sortField == this.state.sortField) {
      if (this.state.sort == 'asc') {
        className += ' sort__icon_up';
      } else {
        className += ' sort__icon_down';
      }
    }

    return className;
  }

  getCountriesTableHeader() {
    let header = /*#__PURE__*/React.createElement("tr", {
      className: "country__header"
    }, /*#__PURE__*/React.createElement("th", {
      className: this.state.currScrollPosition > 0 ? 'active' : ''
    }, "Country"), /*#__PURE__*/React.createElement("th", {
      onClick: this.onSort.bind(null, 'incidence_today')
    }, "C ", /*#__PURE__*/React.createElement("i", {
      className: this.getSortIconClassName('incidence_today')
    })), /*#__PURE__*/React.createElement("th", {
      onClick: this.onSort.bind(null, 'incidence_7_days_ago')
    }, "C week ago", /*#__PURE__*/React.createElement("i", {
      className: this.getSortIconClassName('incidence_7_days_ago')
    })), /*#__PURE__*/React.createElement("th", {
      onClick: this.onSort.bind(null, 'incidence_13_days_ago')
    }, "C 13\xA0days ago", /*#__PURE__*/React.createElement("i", {
      className: this.getSortIconClassName('incidence_13_days_ago')
    })), /*#__PURE__*/React.createElement("th", null, "C", /*#__PURE__*/React.createElement("sub", null, "e"), " range"), /*#__PURE__*/React.createElement("th", {
      onClick: this.onSort.bind(null, 'compare')
    }, "C", /*#__PURE__*/React.createElement("sub", null, "e"), " vs C 13\xA0days ago", /*#__PURE__*/React.createElement("i", {
      className: this.getSortIconClassName('compare')
    })), /*#__PURE__*/React.createElement("th", {
      onClick: this.onSort.bind(null, 'death_incidence_today')
    }, "D ", /*#__PURE__*/React.createElement("i", {
      className: this.getSortIconClassName('death_incidence_today')
    })), /*#__PURE__*/React.createElement("th", {
      onClick: this.onSort.bind(null, 'record_death_incidence')
    }, "D max ", /*#__PURE__*/React.createElement("i", {
      className: this.getSortIconClassName('record_death_incidence')
    })), /*#__PURE__*/React.createElement("th", null, "Dynamics in\xA07\xA0weeks"), /*#__PURE__*/React.createElement("th", null, "Update"));
    return header;
  }

  getCountriesRows(countries) {
    var countriesRows = countries.map(function (countryData) {
      let country = countryData.country_data,
          regions = countryData.regions;
      let countryRow, regionRows;

      if (this.state.showAllWorld) {
        countryRow = this.getCountryRowHTML(country);
        regionRows = this.getRegionRowsHTML(regions);
      } else {
        if (country.continent == 'Europe' || country.country_name == 'Uzbekistan' || country.country_name == 'United_States_of_America') {
          if (country.country_name != 'Bosnia_and_Herzegovina' && country.country_name != 'Kosovo' && country.country_name != 'North_Macedonia' && country.country_name != 'Moldova' && country.country_name != 'Albania') {
            countryRow = this.getCountryRowHTML(country);
            regionRows = this.getRegionRowsHTML(regions);
          }
        }
      }

      return [countryRow, regionRows];
    }.bind(this));
    return countriesRows;
  }

  getCountryRowHTML(country) {
    let countryRow;
    countryRow = /*#__PURE__*/React.createElement("tr", {
      key: country.position,
      className: this.getRowClassName(country.country_name, country.display_name)
    }, /*#__PURE__*/React.createElement("td", {
      className: this.getCountryClassName()
    }, this.getCountryName(country.country_name)), /*#__PURE__*/React.createElement("td", {
      className: this.getIncidenceClassName(country.display_name)
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
    return countryRow;
  }

  getRegionRowsHTML(regions) {
    let regionRows;

    if (!this.state.hideRegions) {
      regionRows = regions.map(region => /*#__PURE__*/React.createElement("tr", {
        key: region.region_data.region_name,
        className: "country country__region"
      }, /*#__PURE__*/React.createElement("td", {
        className: this.getRegionClassName()
      }, this.getRegionName(region.region_data.region_name)), /*#__PURE__*/React.createElement("td", null, region.region_data.incidence_today), /*#__PURE__*/React.createElement("td", null, region.region_data.incidence_7_days_ago > 0 ? region.region_data.incidence_7_days_ago : '-'), /*#__PURE__*/React.createElement("td", null, region.region_data.incidence_13_days_ago > 0 ? region.region_data.incidence_13_days_ago : '-'), /*#__PURE__*/React.createElement("td", null, this.getRegionRange(region.region_data.estimated_from, region.region_data.estimated_t)), /*#__PURE__*/React.createElement("td", {
        className: "country__region_compared"
      }, "-"), /*#__PURE__*/React.createElement("td", null, "-"), /*#__PURE__*/React.createElement("td", null, "-"), /*#__PURE__*/React.createElement("td", null, "-"), /*#__PURE__*/React.createElement("td", null, region.region_data.last_update_date)));
    }

    return regionRows;
  }

  toggleCountriesQuantity() {
    this.setState({
      showAllWorld: !this.state.showAllWorld
    });
  }

  toggleRegionsView() {
    this.setState({
      hideRegions: !this.state.hideRegions
    });
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
      return /*#__PURE__*/React.createElement("div", {
        className: "countries-table__wrapper"
      }, /*#__PURE__*/React.createElement("button", {
        className: "countries-table__btn toggle-view",
        onClick: this.toggleCountriesQuantity
      }, this.state.showAllWorld ? 'Show less' : 'Show more'), /*#__PURE__*/React.createElement("button", {
        className: "countries-table__btn hide-regions",
        onClick: this.toggleRegionsView
      }, this.state.hideRegions ? 'Show regions*' : 'Hide regions*'), /*#__PURE__*/React.createElement("p", null, "* only for German, Austria and Russia"), /*#__PURE__*/React.createElement("div", {
        className: "countries-table__wrap",
        onScroll: this.handleScrollTable
      }, /*#__PURE__*/React.createElement("table", {
        className: "countries-table"
      }, /*#__PURE__*/React.createElement("thead", null, this.getCountriesTableHeader()), /*#__PURE__*/React.createElement("tbody", null, this.getCountriesRows(sortedCountries))), /*#__PURE__*/React.createElement("div", {
        className: this.getOverflowClassName()
      })));
    }
  }

}

class TextDescription extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "description"
    }, /*#__PURE__*/React.createElement("p", null, "C \u2013 corona-cases per 100,000 people per last week. Highlighted in red, if today is record"), /*#__PURE__*/React.createElement("p", null, "C", /*#__PURE__*/React.createElement("sub", null, "e"), " \u2013 estimated C 13\xA0days ago (\u0441alculated by deaths in 13 days if the lethality of the virus is 0.5% or 1%)"), /*#__PURE__*/React.createElement("p", null, "D \u2013 death per 100,000 people per last week"), /*#__PURE__*/React.createElement("p", null, "Countries with a record this week are highlighted in red."), /*#__PURE__*/React.createElement("p", null, "Cells in column C vs C", /*#__PURE__*/React.createElement("sub", null, "e"), " are highlighted in red, if\xA0C", /*#__PURE__*/React.createElement("sub", null, "e"), "\xA0is\xA0100%\xA0more"));
  }

}

class App extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "container"
    }, /*#__PURE__*/React.createElement(TextDescription, null), /*#__PURE__*/React.createElement(CountriesTable, null));
  }

}

;
ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.querySelector("#main"));