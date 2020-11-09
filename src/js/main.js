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
  getCountyName (countryName) {
    if (countryName == 'United_States_of_America') {
      countryName = 'USA';
    }
    return countryName;
  }
  getCountryRange (estimatedFrom, estimatedTo) {
    var range = estimatedFrom+' - '+estimatedTo;
    return range;
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
      content = (estimatedFrom*100/incidence - 100).toFixed();
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

  getCountriesRows (countries) {
    var countriesRows = countries.map((country) =>
      (<tr key={country.country_data.position}
          className={
            this.getRowClassName(
              country.country_data.country_name,
              country.country_data.display_name)
          }>
        <td className={this.getCountryClassName()}>
          {this.getCountyName(country.country_data.country_name)}
        </td>
        <td className="country__cases">
          {country.country_data.incidence_today}
        </td>
        <td className="country__cases-week-ago">
          {country.country_data.incidence_7_days_ago}
        </td>
        <td className="country__cases-two-weeks-ago">
          {country.country_data.incidence_13_days_ago}
        </td>
        <td className="country__range">
          {this.getCountryRange(
            country.country_data.estimated_from,
            country.country_data.estimated_to)}
        </td>
        <td className={
          this.getCompareClassName(
            country.country_data.estimated_from,
            country.country_data.estimated_to,
            country.country_data.incidence_13_days_ago)
          }>
          {this.getCompareContent(
            country.country_data.estimated_from,
            country.country_data.estimated_to,
            country.country_data.incidence_13_days_ago)
          }
        </td>
        <td className="country__death">
          {country.country_data.death_incidence_today.toFixed(2)}
        </td>
        <td className="country__death-max">
          {country.country_data.record_death_incidence.toFixed(2)}
        </td>
        <td className="country__dynamic">
          {country.country_data.direction_symbols}
        </td>
        <td className="country__update">
          {country.country_data.last_update_date}
        </td>
      </tr>)
    );
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
          {<CountiesTable />}
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
