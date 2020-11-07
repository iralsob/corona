function getData() {
  let url = 'https://bretonium.net/countries.json';
  return fetch(url);
}

function handleScroll(e) {
  var elm = e.target;
  var scrollPosition = elm.scrollLeft;
  var endScrollPosition = elm.scrollWidth - elm.offsetWidth - 10;

  var fcElements = document.getElementsByClassName("js-toggle-shadow-fc");
  var wElements = document.getElementsByClassName("js-toggle-shadow-w");

  if (scrollPosition == 0){
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

function createCountriesTable(data){
  var countriesTable = (
    <div>
      <div>
        <p>C &ndash; corona-cases per 100,000 people per last week</p>
        <p>C<sub>e</sub> &ndash; estimated C (сalculated by deaths in 13 days if the lethality of the virus is 0.5% or 1%)</p>
        <p>D &ndash; death per 100,000 people per last week</p>
        <p>Countries with a record this week are highlighted in red</p>
      </div>
      <div className="countries-table__wrapper">
        <div className="countries-table__wrap" onScroll={handleScroll}>
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
                {createCountryRows(data)}
              </tbody>
          </table>
          <div className="countries-table__overflow js-toggle-shadow-w active"></div>
        </div>
      </div>
    </div>
  );
  return countriesTable;
}

function createCountryRows(data){
  var sortedCountries = data.sorted_countries;
  var countriesRows = sortedCountries.map((country) =>
    (<tr key={country.country_data.position} className={country.country_data.country_name==country.country_data.display_name?'countries-table__row country':'countries-table__row country record'}>
        <td className="country__name js-toggle-shadow-fc">
          {country.country_data.country_name=='United_States_of_America'?'USA':country.country_data.country_name}
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
          {country.country_data.estimated_from}-{country.country_data.estimated_to}
        </td>
        <td className={country.country_data.estimation_match_symbol=="<"?'country__compared more':'country__compared'}>
          {(country.country_data.estimated_from*100/country.country_data.incidence_13_days_ago-100).toFixed()}%
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

function getContent() {

  return getData().then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      let countries_table = response.json().then(function(data) {
        return createCountriesTable(data);
      });
      return countries_table;
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });

}

function App () {
  return getContent().then(content => {
    return (
        <div className="container">{content}</div>
    );
  })
};

App().then(app => {
  ReactDOM.render(app, document.querySelector("#main"));
})
