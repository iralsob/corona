

async function getJSON() {
  let response = await fetch('https://irisob.github.io/corona/build/data/data.json');

  if (response.ok) {
    let json = await response.json();
    console.log(json);
    return json;
  } else {
    console.log(response.ok);
  }
}


var data = getJSON();

class App extends React.Component {

  render() {

    // var element = (
    //   <table className="table">
    //       <thead>
    //           <tr>
    //               <th>Страна</th>
    //               <th>Число случаев за 7 дней на 100 тыс.</th>
    //               <th>Неделю назад</th>
    //               <th>2 Недели назад</th>
    //               <th>Эмулированное по смертям (макс)</th>
    //               <th>Эмулированное по смертям (диапазон)</th>
    //               <th>По отношению к прошлой неделе</th>
    //               <th>Динамика за 7 дней</th>
    //           </tr>
    //       </thead>
    //       <tbody>
    //
    //       </tbody>
    //   </table>
    // );

    return (
        <div  className="container">Meow</div>
    );
  }
};


ReactDOM.render(<App/>, document.querySelector("#main"));
