function getData() {
  let url = 'https://irisob.github.io/corona/build/data/data.json';
  return fetch(url);
}

function createCountriesTable(data){
  var countriesTable = (
    <div>
      <div>
        <p>N - corona-cases per 100,000 people per week</p>
        <p>N<sub>e</sub> range - emulated N (сalculated by deaths in 7 days if the lethality of the virus is 0.5% or 1%)</p>
        <p>Countries with a record this week are highlighted in red</p>
      </div>
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
  );
  return countriesTable;
}

function createCountryRows(data){
  var countriesRows = data.map((country) =>
    (<tr key={country.id} className={country.is_this_week_record?'record':''}>
        <td>{country.country_name}</td>
        <td>{country.cases_per_ht}</td>
        <td>{country.cases_per_ht_week_ago}</td>
        <td>{country.cases_per_ht_two_week_ago}</td>
        <td>{country.es_from}-{country.es_to}</td>
        <td className={country.estimation_match_symbol==">"?'more':''}>{country.estimation_match_symbol}</td>
        <td>{country.direction}</td>
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
