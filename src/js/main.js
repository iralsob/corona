// load in JSON data from file
var data;

var oReq = new XMLHttpRequest();
oReq.onload = reqListener;
oReq.open("get", "data/data.json", true);
oReq.send();

function reqListener(e) {
    data = JSON.parse(this.responseText);
}
console.log(data);

class App extends React.Component {


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

  render() {
    return (
        <div  className="container">Meow</div>
    );
  }
};


ReactDOM.render(<App/>, document.querySelector("#main"));
