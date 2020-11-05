function getData() {
  let url = 'https://irisob.github.io/corona/build/data/data.json';
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
        <p>N &ndash; corona-cases per 100,000 people per week</p>
        <p>N<sub>e</sub> &ndash; emulated N (сalculated by deaths in 7 days if the lethality of the virus is 0.5% or 1%)</p>
        <p>R &ndash; reported corona-cases 2 weeks ago</p>
        <p>Countries with a record this week are highlighted in red</p>
      </div>
      <div className="countries-table__wrapper">
        <div className="countries-table__wrap" onScroll={handleScroll}>
          <table className="countries-table">
              <thead>
                  <tr>
                      <th className="js-toggle-shadow-fc">Country</th>
                      <th>N</th>
                      <th>N week ago</th>
                      <th>N 2&nbsp;weeks ago</th>
                      <th>N<sub>e</sub> range</th>
                      <th>N<sub>e</sub> vs R 2&nbsp;weeks ago</th>
                      <th>Weekly dynamics</th>
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
  var countriesRows = data.map((country) =>
    (<tr key={country.id} className={country.is_this_week_record?'countries-table__row country record':'countries-table__row country'}>
        <td className="country__name js-toggle-shadow-fc">
          {country.country_name}
        </td>
        <td className="country__cases">
          {country.cases_per_ht}
        </td>
        <td className="country__cases-week-ago">
          {country.cases_per_ht_week_ago}
        </td>
        <td className="country__cases-two-weeks-ago">
          {country.cases_per_ht_two_week_ago}
        </td>
        <td className="country__range">
          {country.es_from}-{country.es_to}
        </td>
        <td className={country.estimation_match_symbol==">"?'country__compared more':'country__compared'}>
          {country.estimation_match_symbol}
        </td>
        <td className="country__dynamic">
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
