function getData() {
  let url = 'https://irisob.github.io/corona/build/data/data.json';
  return fetch(url);
}

function createCountriesTable(data){
  var countriesTable = (
    <div>
      <div>
        <p>N &ndash; corona-cases per 100,000 people per week</p>
        <p>N<sub>e</sub> range &ndash; emulated N (сalculated by deaths in 7 days if the lethality of the virus is 0.5% or 1%)</p>
        <p>Countries with a record this week are highlighted in red</p>
      </div>
      <div className="countries-table_wrap">
        <table className="countries-table">
            <thead>
                <tr>
                    <th>Country</th>
                    <th>N</th>
                    <th>N week ago</th>
                    <th>N 2 weeks ago</th>
                    <th>N<sub>e</sub> range</th>
                    <th>Compared to last week</th>
                    <th>Weekly dynamics</th>
                </tr>
            </thead>
            <tbody>
              {createCountryRows(data)}
            </tbody>
        </table>
      </div>
    </div>
  );
  return countriesTable;
}

function createCountryRows(data){
  var countriesRows = data.map((country) =>
    (<tr key={country.id} className={country.is_this_week_record?'countries-table__row country record':'countries-table__row country'}>
        <td className="country_name">
          {country.country_name}
        </td>
        <td className="country_cases">
          {country.cases_per_ht}
        </td>
        <td className="country_cases-week-ago">
          {country.cases_per_ht_week_ago}
        </td>
        <td className="country_cases-two-weeks-ago">
          {country.cases_per_ht_two_week_ago}
        </td>
        <td className="country_range">
          {country.es_from}-{country.es_to}
        </td>
        <td className={country.estimation_match_symbol==">"?'country_compared more':'country_compared'}>
          {country.estimation_match_symbol}
        </td>
        <td className="country_dynamic">
          {country.direction}
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
