class CountriesTable extends React.Component {
  constructor(props) {
    super(props);
    this.handleScrollTable = this.handleScrollTable.bind(this);
    this.onSort = this.onSort.bind(this);
    this.toggleCountriesQuantity = this.toggleCountriesQuantity.bind(this);
    this.state = {
      currScrollPosition: 0,
      reachEndScrollPosition: false,
      error: 0,
      isLoaded: false,
      countries: {},
      sortField: 'incidence_today',
      sort: 'asc',
      showAllWorld: false
    };
  }
  componentDidMount() {
    this.getData().then(response => response.json())
    .then(
      (countries) => {
        this.setState({
          isLoaded: true,
          countries
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  }
  getData() {
    let url = 'https://bretonium.net/countries.json';
    return fetch(url);
  }
  handleScrollTable(e) {
    let elm = e.target;

    this.setState({currScrollPosition: elm.scrollLeft});

    const endScrollPosition = elm.scrollWidth - elm.offsetWidth - 10;
    if (elm.scrollLeft >= endScrollPosition) {
      this.setState({reachEndScrollPosition: true});
    } else {
      this.setState({reachEndScrollPosition: false});
    }
  }
  onSort(sortField) {
    const cloneData = this.state.countries.sorted_countries;
    let sortType;

    // add column 'compare' for sort
    for (let i=0; i<cloneData.length; i++) {
      let country = cloneData[i].country_data;
      if(country.incidence_13_days_ago == 0) {
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

    const orderedData = _.orderBy(
      cloneData,
      [function(o) {
        return o.country_data[sortField];
      }],
      sortType);

    this.setState({
      countries: {'sorted_countries': orderedData},
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
    if(this.state.currScrollPosition > 0){
      className += ' active';
    }
    return className;
  }
  getRegionClassName() {
    let className = '';
    if(this.state.currScrollPosition > 0){
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
      if (difference >= 100){
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
    }  else {
      content += 'within range';
    }

    return content;
  }
  getOverflowClassName() {
    let overflowClassName = 'countries-table__overflow';
    if(!this.state.reachEndScrollPosition){
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
    if(sortField == this.state.sortField) {
      if(this.state.sort == 'asc') {
        className += ' sort__icon_up';
      } else {
        className += ' sort__icon_down';
      }
    }
    return className;
  }
  getCountriesTableHeader() {
    let header = (
      <tr className="country__header">
        <th className={
          this.state.currScrollPosition>0
          ?'active':''}>
          Country
        </th>
        <th onClick={
          this.onSort.bind(null, 'incidence_today')
        }>
          C <i className={
            this.getSortIconClassName('incidence_today')
          }></i>
        </th>
        <th onClick={
          this.onSort.bind(null, 'incidence_7_days_ago')
        }>
          C week ago
          <i className={
            this.getSortIconClassName('incidence_7_days_ago')
          }></i>
        </th>
        <th onClick={
          this.onSort.bind(null, 'incidence_13_days_ago')
        }>
          C 13&nbsp;days ago
          <i className={
            this.getSortIconClassName('incidence_13_days_ago')
          }></i>
        </th>
        <th>
          C<sub>e</sub> range
        </th>
        <th onClick={this.onSort.bind(null, 'compare')}>
          C<sub>e</sub> vs C 13&nbsp;days ago
          <i className={
            this.getSortIconClassName('compare')
          }></i>
        </th>
        <th onClick={
          this.onSort.bind(null, 'death_incidence_today')
        }>
          D <i className={
            this.getSortIconClassName('death_incidence_today')
          }></i>
        </th>
        <th onClick={
          this.onSort.bind(null, 'record_death_incidence')
        }>
          D max <i className={
            this.getSortIconClassName('record_death_incidence')
          }></i>
        </th>
        <th>Dynamics in&nbsp;7&nbsp;weeks</th>
        <th>Update</th>
      </tr>
    );
    return header;
  }
  getCountriesRows(countries) {
    var countriesRows = countries.map(function(countryData) {
      let country = countryData.country_data,
          regions = countryData.regions;

      let countryRow, regionRows;

      if (this.state.showAllWorld) {
        countryRow = this.getCountryRowHTML(country);
        regionRows = this.getRegionRowsHTML(regions);
      } else {
        if(country.continent == 'Europe'
          || country.country_name == 'Uzbekistan'
          || country.country_name == 'United_States_of_America'){

          if (country.country_name != 'Bosnia_and_Herzegovina'
            && country.country_name != 'Kosovo'
            && country.country_name != 'North_Macedonia'
            && country.country_name != 'Moldova'
            && country.country_name != 'Albania') {

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
    countryRow = (
      <tr key={country.position} className={
        this.getRowClassName(
          country.country_name,
          country.display_name
        )}>
        <td className={this.getCountryClassName()}>
          {this.getCountryName(country.country_name)}
        </td>
        <td className={this.getIncidenceClassName(country.display_name)}>
          {country.incidence_today}
        </td>
        <td className="country__cases-week-ago">
          {country.incidence_7_days_ago}
        </td>
        <td className="country__cases-two-weeks-ago">
          {country.incidence_13_days_ago}
        </td>
        <td className="country__range">
          {this.getCountryRange(
            country.estimated_from,
            country.estimated_to)}
        </td>
        <td className={
          this.getCompareClassName(
            country.estimated_from,
            country.estimated_to,
            country.incidence_13_days_ago
          )}>
          {this.getCompareContent(
            country.estimated_from,
            country.estimated_to,
            country.incidence_13_days_ago)}
        </td>
        <td className="country__death">
          {country.death_incidence_today.toFixed(2)}
        </td>
        <td className="country__death-max">
          {country.record_death_incidence.toFixed(2)}
        </td>
        <td className="country__dynamic">
          {country.direction_symbols}
        </td>
        <td className="country__update">
          {country.last_update_date}
        </td>
      </tr>
    );
    return countryRow;
  }
  getRegionRowsHTML(regions) {
    let regionRows;
    regionRows = regions.map((region) =>
      (<tr key={region.region_data.region_name}
        className="country country__region">
        <td className={this.getRegionClassName()}>
          {this.getRegionName(region.region_data.region_name)}
        </td>
        <td>{region.region_data.incidence_today}</td>
        <td>{region.region_data.incidence_7_days_ago > 0
          ?region.region_data.incidence_7_days_ago
          :'-'}
        </td>
        <td>{region.region_data.incidence_13_days_ago > 0
          ?region.region_data.incidence_13_days_ago
          :'-'}
        </td>
        <td>
          {this.getRegionRange(region.region_data.estimated_from,
              region.region_data.estimated_t)}
        </td>
        <td className="country__region_compared">-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>{region.region_data.last_update_date}</td>
      </tr>)
    );
    return regionRows;
  }
  toggleCountriesQuantity() {
    this.setState({
      showAllWorld: !this.state.showAllWorld
    });
  }
  render() {
    const error = this.state.error,
      isLoaded = this.state.isLoaded,
      data = this.state.countries;

    if (error) {
      return <div>Error: {error}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      var sortedCountries = data.sorted_countries;
      return(
        <div className="countries-table__wrapper">
          <button onClick={this.toggleCountriesQuantity}>
            {this.state.showAllWorld?'Show less':'Show more'}
          </button>
          <div
            className="countries-table__wrap"
            onScroll={this.handleScrollTable}>
            <table className="countries-table">
              <thead>
                {this.getCountriesTableHeader()}
              </thead>
              <tbody>
                {this.getCountriesRows(sortedCountries)}
              </tbody>
            </table>
            <div className={this.getOverflowClassName()}></div>
          </div>
        </div>
      );
    }
  }
}

class TextDescription extends React.Component {
  render() {
    return(
      <div className="description">
        <p>
          C &ndash; corona-cases per 100,000 people per last week.
          Highlighted in red, if today is record
        </p>
        <p>
          C<sub>e</sub> &ndash; estimated C 13&nbsp;days ago (сalculated by deaths
          in 13 days if the lethality of the virus is 0.5% or 1%)
        </p>
        <p>D &ndash; death per 100,000 people per last week</p>
        <p>
          Countries with a record this week are highlighted in red.
        </p>
        <p>
          Cells in column C vs C<sub>e</sub> are highlighted in red,
          if&nbsp;C<sub>e</sub>&nbsp;is&nbsp;100%&nbsp;more
        </p>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return(
      <div className="container">
        <TextDescription />
        <CountriesTable />
      </div>
    );
  }
};

ReactDOM.render(
  <App />,
  document.querySelector("#main")
);
