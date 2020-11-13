(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.main = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  var CountriesTable = /*#__PURE__*/function (_React$Component) {
    _inherits(CountriesTable, _React$Component);

    var _super = _createSuper(CountriesTable);

    function CountriesTable(props) {
      var _this;

      _classCallCheck(this, CountriesTable);

      _this = _super.call(this, props);
      _this.handleScrollTable = _this.handleScrollTable.bind(_assertThisInitialized(_this));
      _this.onSort = _this.onSort.bind(_assertThisInitialized(_this));
      _this.toggleCountriesQuantity = _this.toggleCountriesQuantity.bind(_assertThisInitialized(_this));
      _this.toggleRegionsView = _this.toggleRegionsView.bind(_assertThisInitialized(_this));
      _this.state = {
        currScrollPosition: 0,
        reachEndScrollPosition: false,
        error: 0,
        isLoaded: false,
        countries: {},
        sortField: 'incidence_today',
        sort: 'asc',
        showAllWorld: false,
        hideRegions: true
      };
      return _this;
    }

    _createClass(CountriesTable, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this2 = this;

        this.getData().then(function (response) {
          return response.json();
        }).then(function (countries) {
          _this2.setState({
            isLoaded: true,
            countries: countries
          });
        }, function (error) {
          _this2.setState({
            isLoaded: true,
            error: error
          });
        });
      }
    }, {
      key: "getData",
      value: function getData() {
        var url = 'https://bretonium.net/countries.json';
        return fetch(url);
      }
    }, {
      key: "handleScrollTable",
      value: function handleScrollTable(e) {
        var elm = e.target;
        this.setState({
          currScrollPosition: elm.scrollLeft
        });
        var endScrollPosition = elm.scrollWidth - elm.offsetWidth - 10;

        if (elm.scrollLeft >= endScrollPosition) {
          this.setState({
            reachEndScrollPosition: true
          });
        } else {
          this.setState({
            reachEndScrollPosition: false
          });
        }
      }
    }, {
      key: "onSort",
      value: function onSort(sortField) {
        var cloneData = this.state.countries.sorted_countries;
        var sortType; // add column 'compare' for sort

        for (var i = 0; i < cloneData.length; i++) {
          var country = cloneData[i].country_data;

          if (country.incidence_13_days_ago == 0) {
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

        var orderedData = _.orderBy(cloneData, [function (o) {
          return o.country_data[sortField];
        }], sortType);

        this.setState({
          countries: {
            'sorted_countries': orderedData
          },
          sort: sortType,
          sortField: sortField
        });
      }
    }, {
      key: "getRowClassName",
      value: function getRowClassName(name, displayName) {
        var className = 'countries-table__row country';

        if (name != displayName) {
          className += ' record';
        }

        return className;
      }
    }, {
      key: "getCountryClassName",
      value: function getCountryClassName() {
        var className = "country__name";

        if (this.state.currScrollPosition > 0) {
          className += ' active';
        }

        return className;
      }
    }, {
      key: "getRegionClassName",
      value: function getRegionClassName() {
        var className = '';

        if (this.state.currScrollPosition > 0) {
          className += ' active';
        }

        return className;
      }
    }, {
      key: "getCountryName",
      value: function getCountryName(countryName) {
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
    }, {
      key: "getRegionName",
      value: function getRegionName(regionName) {
        if (regionName == 'Yamalo-Nenets Autonomous Okrug') {
          regionName = 'YaNAO';
        }

        return regionName;
      }
    }, {
      key: "getCountryRange",
      value: function getCountryRange(estimatedFrom, estimatedTo) {
        var range = estimatedFrom + ' - ' + estimatedTo;
        return range;
      }
    }, {
      key: "getRegionRange",
      value: function getRegionRange(rangeFrom, rangeTo) {
        var rangeContent = '-';

        if (rangeFrom) {
          rangeContent = rangeFrom + ' - ' + rangeTo;
        }

        return rangeContent;
      }
    }, {
      key: "getCompareClassName",
      value: function getCompareClassName(estimatedFrom, estimatedTo, incidence) {
        var className = 'country__compared';

        if (incidence < estimatedFrom && incidence > 0) {
          var difference = (estimatedFrom * 100 / incidence - 100).toFixed();

          if (difference >= 100) {
            className += ' more';
          }
        }

        return className;
      }
    }, {
      key: "getCompareContent",
      value: function getCompareContent(estimatedFrom, estimatedTo, incidence) {
        var content = '';

        if (incidence == 0) {
          content += ' ';
        } else if (incidence < estimatedFrom) {
          content += '+';
          content += (estimatedFrom * 100 / incidence - 100).toFixed();
          content += '%';
        } else if (incidence > estimatedTo) {
          content += (estimatedTo * 100 / incidence - 100).toFixed();
          content += '%';
        } else {
          content += 'within range';
        }

        return content;
      }
    }, {
      key: "getOverflowClassName",
      value: function getOverflowClassName() {
        var overflowClassName = 'countries-table__overflow';

        if (!this.state.reachEndScrollPosition) {
          overflowClassName += ' active';
        }

        return overflowClassName;
      }
    }, {
      key: "getIncidenceClassName",
      value: function getIncidenceClassName(displayName) {
        var className = '';

        if (displayName.indexOf('!!') > -1) {
          className = 'more';
        }

        return className;
      }
    }, {
      key: "getSortIconClassName",
      value: function getSortIconClassName(sortField) {
        var className = 'sort__icon';

        if (sortField == this.state.sortField) {
          if (this.state.sort == 'asc') {
            className += ' sort__icon_up';
          } else {
            className += ' sort__icon_down';
          }
        }

        return className;
      }
    }, {
      key: "getCountriesTableHeader",
      value: function getCountriesTableHeader() {
        var header = /*#__PURE__*/React.createElement("tr", {
          className: "country__header"
        }, /*#__PURE__*/React.createElement("th", {
          className: this.state.currScrollPosition > 0 ? 'active' : ''
        }, "Country"), /*#__PURE__*/React.createElement("th", {
          onClick: this.onSort.bind(null, 'incidence_today')
        }, "C ", /*#__PURE__*/React.createElement("i", {
          className: this.getSortIconClassName('incidence_today')
        })), /*#__PURE__*/React.createElement("th", {
          onClick: this.onSort.bind(null, 'incidence_7_days_ago')
        }, "C week ago", /*#__PURE__*/React.createElement("i", {
          className: this.getSortIconClassName('incidence_7_days_ago')
        })), /*#__PURE__*/React.createElement("th", {
          onClick: this.onSort.bind(null, 'incidence_13_days_ago')
        }, "C 13\xA0days ago", /*#__PURE__*/React.createElement("i", {
          className: this.getSortIconClassName('incidence_13_days_ago')
        })), /*#__PURE__*/React.createElement("th", null, "C", /*#__PURE__*/React.createElement("sub", null, "e"), " range"), /*#__PURE__*/React.createElement("th", {
          onClick: this.onSort.bind(null, 'compare')
        }, "C", /*#__PURE__*/React.createElement("sub", null, "e"), " vs C 13\xA0days ago", /*#__PURE__*/React.createElement("i", {
          className: this.getSortIconClassName('compare')
        })), /*#__PURE__*/React.createElement("th", {
          onClick: this.onSort.bind(null, 'death_incidence_today')
        }, "D ", /*#__PURE__*/React.createElement("i", {
          className: this.getSortIconClassName('death_incidence_today')
        })), /*#__PURE__*/React.createElement("th", {
          onClick: this.onSort.bind(null, 'record_death_incidence')
        }, "D max ", /*#__PURE__*/React.createElement("i", {
          className: this.getSortIconClassName('record_death_incidence')
        })), /*#__PURE__*/React.createElement("th", null, "Dynamics in\xA07\xA0weeks"), /*#__PURE__*/React.createElement("th", null, "Update"));
        return header;
      }
    }, {
      key: "getCountriesRows",
      value: function getCountriesRows(countries) {
        var countriesRows = countries.map(function (countryData) {
          var country = countryData.country_data,
              regions = countryData.regions;
          var countryRow, regionRows;

          if (this.state.showAllWorld) {
            countryRow = this.getCountryRowHTML(country);
            regionRows = this.getRegionRowsHTML(regions);
          } else {
            if (country.continent == 'Europe' || country.country_name == 'Uzbekistan' || country.country_name == 'United_States_of_America') {
              if (country.country_name != 'Bosnia_and_Herzegovina' && country.country_name != 'Kosovo' && country.country_name != 'North_Macedonia' && country.country_name != 'Moldova' && country.country_name != 'Albania') {
                countryRow = this.getCountryRowHTML(country);
                regionRows = this.getRegionRowsHTML(regions);
              }
            }
          }

          return [countryRow, regionRows];
        }.bind(this));
        return countriesRows;
      }
    }, {
      key: "getCountryRowHTML",
      value: function getCountryRowHTML(country) {
        var countryRow;
        countryRow = /*#__PURE__*/React.createElement("tr", {
          key: country.position,
          className: this.getRowClassName(country.country_name, country.display_name)
        }, /*#__PURE__*/React.createElement("td", {
          className: this.getCountryClassName()
        }, this.getCountryName(country.country_name)), /*#__PURE__*/React.createElement("td", {
          className: this.getIncidenceClassName(country.display_name)
        }, country.incidence_today), /*#__PURE__*/React.createElement("td", {
          className: "country__cases-week-ago"
        }, country.incidence_7_days_ago), /*#__PURE__*/React.createElement("td", {
          className: "country__cases-two-weeks-ago"
        }, country.incidence_13_days_ago), /*#__PURE__*/React.createElement("td", {
          className: "country__range"
        }, this.getCountryRange(country.estimated_from, country.estimated_to)), /*#__PURE__*/React.createElement("td", {
          className: this.getCompareClassName(country.estimated_from, country.estimated_to, country.incidence_13_days_ago)
        }, this.getCompareContent(country.estimated_from, country.estimated_to, country.incidence_13_days_ago)), /*#__PURE__*/React.createElement("td", {
          className: "country__death"
        }, country.death_incidence_today.toFixed(2)), /*#__PURE__*/React.createElement("td", {
          className: "country__death-max"
        }, country.record_death_incidence.toFixed(2)), /*#__PURE__*/React.createElement("td", {
          className: "country__dynamic"
        }, country.direction_symbols), /*#__PURE__*/React.createElement("td", {
          className: "country__update"
        }, country.last_update_date));
        return countryRow;
      }
    }, {
      key: "getRegionRowsHTML",
      value: function getRegionRowsHTML(regions) {
        var _this3 = this;

        var regionRows;

        if (!this.state.hideRegions) {
          regionRows = regions.map(function (region) {
            return /*#__PURE__*/React.createElement("tr", {
              key: region.region_data.region_name,
              className: "country country__region"
            }, /*#__PURE__*/React.createElement("td", {
              className: _this3.getRegionClassName()
            }, _this3.getRegionName(region.region_data.region_name)), /*#__PURE__*/React.createElement("td", null, region.region_data.incidence_today), /*#__PURE__*/React.createElement("td", null, region.region_data.incidence_7_days_ago > 0 ? region.region_data.incidence_7_days_ago : '-'), /*#__PURE__*/React.createElement("td", null, region.region_data.incidence_13_days_ago > 0 ? region.region_data.incidence_13_days_ago : '-'), /*#__PURE__*/React.createElement("td", null, _this3.getRegionRange(region.region_data.estimated_from, region.region_data.estimated_t)), /*#__PURE__*/React.createElement("td", {
              className: "country__region_compared"
            }, "-"), /*#__PURE__*/React.createElement("td", null, "-"), /*#__PURE__*/React.createElement("td", null, "-"), /*#__PURE__*/React.createElement("td", null, "-"), /*#__PURE__*/React.createElement("td", null, region.region_data.last_update_date));
          });
        }

        return regionRows;
      }
    }, {
      key: "toggleCountriesQuantity",
      value: function toggleCountriesQuantity() {
        this.setState({
          showAllWorld: !this.state.showAllWorld
        });
      }
    }, {
      key: "toggleRegionsView",
      value: function toggleRegionsView() {
        this.setState({
          hideRegions: !this.state.hideRegions
        });
      }
    }, {
      key: "render",
      value: function render() {
        var error = this.state.error,
            isLoaded = this.state.isLoaded,
            data = this.state.countries;

        if (error) {
          return /*#__PURE__*/React.createElement("div", null, "Error: ", error);
        } else if (!isLoaded) {
          return /*#__PURE__*/React.createElement("div", null, "Loading...");
        } else {
          var sortedCountries = data.sorted_countries;
          return /*#__PURE__*/React.createElement("div", {
            className: "countries-table__wrapper"
          }, /*#__PURE__*/React.createElement("button", {
            className: "countries-table__btn toggle-view",
            onClick: this.toggleCountriesQuantity
          }, this.state.showAllWorld ? 'Show less' : 'Show more'), /*#__PURE__*/React.createElement("button", {
            className: "countries-table__btn hide-regions",
            onClick: this.toggleRegionsView
          }, this.state.hideRegions ? 'Show regions' : 'Hide regions'), /*#__PURE__*/React.createElement("div", {
            className: "countries-table__wrap",
            onScroll: this.handleScrollTable
          }, /*#__PURE__*/React.createElement("table", {
            className: "countries-table"
          }, /*#__PURE__*/React.createElement("thead", null, this.getCountriesTableHeader()), /*#__PURE__*/React.createElement("tbody", null, this.getCountriesRows(sortedCountries))), /*#__PURE__*/React.createElement("div", {
            className: this.getOverflowClassName()
          })));
        }
      }
    }]);

    return CountriesTable;
  }(React.Component);

  var TextDescription = /*#__PURE__*/function (_React$Component2) {
    _inherits(TextDescription, _React$Component2);

    var _super2 = _createSuper(TextDescription);

    function TextDescription() {
      _classCallCheck(this, TextDescription);

      return _super2.apply(this, arguments);
    }

    _createClass(TextDescription, [{
      key: "render",
      value: function render() {
        return /*#__PURE__*/React.createElement("div", {
          className: "description"
        }, /*#__PURE__*/React.createElement("p", null, "C \u2013 corona-cases per 100,000 people per last week. Highlighted in red, if today is record"), /*#__PURE__*/React.createElement("p", null, "C", /*#__PURE__*/React.createElement("sub", null, "e"), " \u2013 estimated C 13\xA0days ago (\u0441alculated by deaths in 13 days if the lethality of the virus is 0.5% or 1%)"), /*#__PURE__*/React.createElement("p", null, "D \u2013 death per 100,000 people per last week"), /*#__PURE__*/React.createElement("p", null, "Countries with a record this week are highlighted in red."), /*#__PURE__*/React.createElement("p", null, "Cells in column C vs C", /*#__PURE__*/React.createElement("sub", null, "e"), " are highlighted in red, if\xA0C", /*#__PURE__*/React.createElement("sub", null, "e"), "\xA0is\xA0100%\xA0more"));
      }
    }]);

    return TextDescription;
  }(React.Component);

  var App = /*#__PURE__*/function (_React$Component3) {
    _inherits(App, _React$Component3);

    var _super3 = _createSuper(App);

    function App() {
      _classCallCheck(this, App);

      return _super3.apply(this, arguments);
    }

    _createClass(App, [{
      key: "render",
      value: function render() {
        return /*#__PURE__*/React.createElement("div", {
          className: "container"
        }, /*#__PURE__*/React.createElement(TextDescription, null), /*#__PURE__*/React.createElement(CountriesTable, null));
      }
    }]);

    return App;
  }(React.Component);

  ;
  ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.querySelector("#main"));
});