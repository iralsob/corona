function getData() {
  const Http = new XMLHttpRequest();
  const url='https://bretonium.net/countries.json';
  Http.open("GET", url, false);
  Http.send();
  return Http.responseText;
}


class CountiesTable extends React.Component {
  getRowClass (name, displayName) {
    var className = 'countries-table__row country';
    if (name != displayName) {
      className += ' record';
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
  getCompareClass (estimatedFrom, estimatedTo, incidence) {
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
  getCountriesRows (countries) {
    var countriesRows = countries.map((country) =>
        (<tr key={country.country_data.position}
            className={
              this.getRowClass(
                country.country_data.country_name,
                country.country_data.display_name)
            }>
            <td className="country__name js-toggle-shadow-fc">
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
              this.getCompareClass(
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
        </tr>));
    return countriesRows;
  }

  render() {
    const data = JSON.parse(getData());
    var sortedCountries = data.sorted_countries;

    return(
      <div className="countries-table__wrapper js-table">
        <div className="countries-table__wrap">
          <table className="countries-table">
              <thead>
                  <tr>
                      <th className="js-toggle-shadow-fc">Country</th>
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
          <div className="countries-table__overflow js-toggle-shadow-w active"></div>
        </div>
      </div>);
  }
}
class Content extends React.Component {
    render () {
      return (
        <div>
          <div>
            <p>C &ndash; corona-cases per 100,000 people per last week</p>
            <p>C<sub>e</sub> &ndash; estimated C (сalculated by deaths in 13 days if the lethality of the virus is 0.5% or 1%)</p>
            <p>D &ndash; death per 100,000 people per last week</p>
            <p>Countries with a record this week are highlighted in red</p>
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
