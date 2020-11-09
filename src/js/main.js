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

  componentDidMount(){
    getData().then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          countries: result
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error: error
        });
      }
    );
  }

  handleScrollTable (e) {
    var elm = e.target;

    this.setState({currScrollPosition: elm.scrollLeft});

    var endScrollPosition = elm.scrollWidth - elm.offsetWidth - 10;
    if (elm.scrollLeft >= endScrollPosition) {
      this.setState({reachEndScrollPosition: true});
    } else {
      this.setState({reachEndScrollPosition: false});
    }
  }
  getRowClassName (name, displayName) {
    var className = 'countries-table__row country';
    if (name != displayName) {
      className += ' record';
    }
    return className;
  }
  getCountryClassName () {
    var className = "country__name";
    if(this.state.currScrollPosition > 0){
      className += ' active';
    }
    return className;
  }
  getRegionClassName () {
    var className = '';
    if(this.state.currScrollPosition > 0){
      className += ' active';
    }
    return className;
  }
  getCountyName (countryName) {
    if (countryName == 'United_States_of_America') {
      countryName = 'USA';
    }
    return countryName;
  }
  getRegionName (regionName) {
    if (regionName == 'Yamalo-Nenets Autonomous Okrug') {
      regionName = 'YaNAO';
    }
    return regionName;
  }
  getCountryRange (estimatedFrom, estimatedTo) {
    var range = estimatedFrom+' - '+estimatedTo;
    return range;
  }
  getRegionRange(rangeFrom, rangeTo) {
    var rangeContent = '-';
    if (rangeFrom){
      rangeContent = rangeFrom + ' - ' + rangeTo;
    }
    return rangeContent;
  }
  getCompareClassName (estimatedFrom, estimatedTo, incidence) {
    var className = 'country__compared';
    if (incidence < estimatedFrom) {
      var difference = (estimatedFrom*100/incidence - 100).toFixed();
      if (difference >= 100){
        className += ' more';
      }
    }
    return className;
  }
  getCompareContent (estimatedFrom, estimatedTo, incidence) {
    var content;
    if (incidence < estimatedFrom) {
      content = '+'+(estimatedFrom*100/incidence - 100).toFixed();
      content += '%';
    } else if (incidence > estimatedTo) {
      content = (estimatedTo*100/incidence - 100).toFixed();
      content += '%';
    }  else {
      content = 'within range';
    }

    return content;
  }
  getOverflowClassName () {
    var overflowClassName = 'countries-table__overflow';
    if(!this.state.reachEndScrollPosition){
      overflowClassName += ' active';
    }
    return overflowClassName;
  }
  getCountriesSubRows(regions){
    var regions = (<tr><td>1</td></tr>);
    return regions;
  }
  getCountriesRows (countries) {
    var countriesRows = countries.map(function(countryData) {
      var country = countryData.country_data;
      var countryRow = (<tr key={country.position}
          className={
            this.getRowClassName(
              country.country_name,
              country.display_name)
          }>
        <td className={this.getCountryClassName()}>
          {this.getCountyName(country.country_name)}
        </td>
        <td className="country__cases">
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
            country.incidence_13_days_ago)
          }>
          {this.getCompareContent(
            country.estimated_from,
            country.estimated_to,
            country.incidence_13_days_ago)
          }
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
      </tr>);


      var regions = countryData.regions;
      if(regions.length) {
        var regionRows = regions.map((region) =>
          (<tr  key={region.region_data.region_name}
                className="country__region">
            <td className={this.getRegionClassName()}>
              {this.getRegionName(region.region_data.region_name)}
            </td>
            <td>{region.region_data.incidence_today}</td>
            <td>{region.region_data.incidence_7_days_ago>0
              ?region.region_data.incidence_7_days_ago
              :'-'}</td>
            <td>{region.region_data.incidence_13_days_ago>0
              ?region.region_data.incidence_13_days_ago
              :'-'}</td>
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
      return <div>Error: {error}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      var sortedCountries = data.sorted_countries;

      var hCountryClassName = '';
      if(this.state.currScrollPosition != 0){
        hCountryClassName += 'active';
      }
      return(
        <div className="countries-table__wrapper">
          <div
            className="countries-table__wrap"
            onScroll={this.handleScrollTable}>
            <table className="countries-table">
              <thead>
                <tr>
                  <th className={hCountryClassName}>Country</th>
                  <th>C</th>
                  <th>C week ago</th>
                  <th>C 13&nbsp;days ago</th>
                  <th>C<sub>e</sub> range</th>
                  <th>C<sub>e</sub> vs C 13&nbsp;days ago</th>
                  <th>D</th>
                  <th>D max</th>
                  <th>Weekly dynamics</th>
                  <th>Update</th>
                </tr>
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
class Content extends React.Component {
    render () {
      return (
        <div>
          <div>
            <p>C &ndash; corona-cases per 100,000 people per last week</p>
            <p>C<sub>e</sub> &ndash; estimated C (сalculated by deaths
              in 13 days if the lethality of the virus is 0.5% or 1%)</p>
            <p>D &ndash; death per 100,000 people per last week</p>
            <p>
              Countries with a record this week are highlighted in red.
            </p>
            <p>Cells in column C vs C<sub>e</sub> are highlighted in red,
              if&nbsp;C<sub>e</sub>&nbsp;is&nbsp;100%&nbsp;more
            </p>
          </div>
          {<CountriesTable />}
        </div>
      );
    }
}
class App extends React.Component {
  render () {
      return (
          <div className="container">{<Content/>}</div>
      );
  }
};

ReactDOM.render(
  <App />,
  document.querySelector("#main")
);
