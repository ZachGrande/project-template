import React, { useEffect, useState } from 'react';
import { useFetch } from "./hooks/useFetch";
import { AiFillPlusCircle, AiFillMinusCircle, AiFillCaretLeft, AiFillCaretDown, AiFillCaretUp, AiFillCaretRight } from "react-icons/ai";
import * as topojson from "topojson-client";
import world from "./land-50m";
import Slider from 'react-rangeslider'
import "react-rangeslider/lib/index.css";
import "./A4styling2.css";
import { select } from 'd3-selection';

/*
* The skeleton for the map was implemented using the documentation for D3's Bubble Map
* https://observablehq.com/@d3/bubble-map
*/

function Assignment4() {

  const [data, loading] = useFetch(
    "https://raw.githubusercontent.com/ZachGrande/info474-react-parcel-template/master/avocado-2020-joined-city-only.csv"
  );

  const [avo_agg_data, loading2] = useFetch(
    "https://raw.githubusercontent.com/ZachGrande/info474-react-parcel-template/sizeChange/aggregated-avocado-2020.csv"
  );

  // Colin's starter code to render world map
  const land = topojson.feature(world, world.objects.land);
  const projection = d3.geoNaturalEarth1();
  const path = d3.geoPath(projection);
  const mapPathString = path(land);
  const radius = d3.scaleSqrt([0, d3.max(avo_agg_data, d => d.total_volume)], [0, 40]);
  const max_height = 25;
  const max_width = 300;
  const min_height = 1;
  const min_width = 1;
  const max_x = 90;
  const max_y = 100
  const x_d3_scale = d3.scaleLinear()
  const y_d3_scale = d3.scaleLinear()

  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(25)
  const [x, setX] = useState(90);
  const [y, setY] = useState(100);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2015)
  const [selectedSize, setSelectedSize] = useState("total_volume")
  const [groupedData, setGroupedData] = useState([]);
  const [spark, setSpark] = useState(true);

  useEffect(() => {
    if (avo_agg_data) {
      getYears()
    }

    if (data) {
      getGroupedData()
    }
  }, [avo_agg_data, data, selectedSize])

  useEffect(() => {
    // console.log(groupedData)
  }, [])

  const getYears = async () => {
    var _years = [];
    await avo_agg_data.forEach((item, i) => {
      const year = parseInt(item.year);
      if (_years.indexOf(year) == -1) {
        _years.push(year)
      }
    });

    setYears(_years)
  }

  handleSizeChange = (event) => {
    // console.log(event.target.value)
    let returnSize = event.target.value
    setSelectedSize(returnSize)
  }

  setRadius = (measurement) => {
    let r = "5"
    let rValue = 0
    if (selectedSize === "4046") {
      rValue = measurement.sm_4046
      if (rValue <= 3780000) {
        r = "1"
      } else if (rValue > 3780000 && rValue <= 7520000) {
        r = "2"
      } else if (rValue > 7520000 && rValue <= 1120000) {
        r = "3"
      } else if (rValue > 1120000 && rValue <= 1500000) {
        r = "4"
      }
    } else if (selectedSize === "4225") {
      rValue = measurement.l_4225
      if (rValue <= 2600000) {
        r = "1"
      } else if (rValue > 2600000 && rValue <= 5100000) {
        r = "2"
      } else if (rValue > 5100000 && rValue <= 7500000) {
        r = "3"
      } else if (rValue > 7500000 && rValue <= 10000000) {
        r = "4"
      }
    } else if (selectedSize === "4770") {
      rValue = measurement.xl_4770
      if (rValue <= 200000) {
        r = "1"
      } else if (rValue > 200000 && rValue <= 400000) {
        r = "2"
      } else if (rValue > 400000 && rValue <= 600000) {
        r = "3"
      } else if (rValue > 600000 && rValue <= 800000) {
        r = "4"
      }
    } else {
      rValue = measurement.total_volume
      if (rValue <= 14000000) {
        r = "1"
      } else if (rValue > 14000000 && rValue <= 26000000) {
        r = "2"
      } else if (rValue > 26000000 && rValue <= 38000000) {
        r = "3"
      } else if (rValue > 38000000 && rValue <= 50000000) {
        r = "4"
      }
    }
    return r
  }

  const getGroupedData = async () => {
    var _groupedData = [];
    await data.sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return aDate - bDate;
    }).forEach((item, i) => {
      const city = item.city;
      const year = item.year;
      const month = parseInt(item.date.split('/')[0]);
      if(!_groupedData[city]) {
        _groupedData[city] = {
          latitude: item.latitude,
          longitude: item.longitude
        };
      }

      if(!_groupedData[city][year]) {
        _groupedData[city][year] = [];
      }

      if(_groupedData[city][year].length < month) {
        _groupedData[city][year].push(parseInt(item[selectedSize]));
      } else {
        const prev = _groupedData[city][year][month - 1];
        _groupedData[city][year][month - 1] = prev + parseInt(item[selectedSize]);
      }
    });
    setGroupedData(_groupedData)
  }

  var listData = avo_agg_data.filter(item => item.year == selectedYear);
  if (selectedSize === "4046") {
    listData = listData.sort(function(a, b){
      return b.sm_4046 - a.sm_4046;
    });
  } else if (selectedSize === "4225") {
    listData = listData.sort(function(a, b){
      return b.l_4225 - a.l_4225;
    });
  } else if (selectedSize === "4770") {
    listData = listData.sort(function(a, b){
      return b.xl_4770 - a.xl_4770;
    });
  } else {
    listData = listData.sort(function(a, b){
      return b.total_volume - a.total_volume;
    });
  }
  
  var tableData = avo_agg_data.filter(item => item.year == selectedYear);
  tableData = tableData.sort(function(a, b){
    return b.total_volume - a.total_volume;
  });

  // Implementation is used from https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
  var currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  var svg = document.getElementsByClassName('tooltip-svg');
  svg = svg[0];

  // var tooltip = document.getElementById('tooltip');
  var tooltip = document.querySelector('#tooltip');

  var triggers = document.getElementsByClassName('tooltip-trigger');
  for (var i = 0; i < triggers.length; i++) {
    triggers[i].addEventListener('mousemove', showTooltip);
    triggers[i].addEventListener('mouseout', hideTooltip);
  }

  function showTooltip(evt) {
    var CTM = svg.getCTM();
    var mouseX = (evt.clientX - CTM.e) / CTM.a;
    var mouseY = (evt.clientY - CTM.f) / CTM.d;
    tooltip.setAttributeNS(null, "x", mouseX - 50 / CTM.a);
    tooltip.setAttributeNS(null, "y", mouseY - 300 / CTM.d);
    tooltip.setAttributeNS(null, "transform", null);
    tooltip.setAttributeNS(null, "visibility", "visible");
  }
  function hideTooltip() {
    tooltip.setAttributeNS(null, "visibility", "hidden");
  }

  return (
    <div className="p-5" style={{ backgroundColor: "#EEF5DD" }} >

      <div className="container-fluid"> {/* extra div wrapper to give more space on sides */}
        <div className="row no-gutters"> {/* header + title area */}
          <div className="col">
            <h2>Final Project: Avocado Sales Dashboard</h2>
            <h4>Zach Grande, Alycia Nguyen, Michelle Ponting, Darren Ma, Erik Thomas-Hommer</h4>
            <p>{loading && "Loading data!"}</p>
            <p>{loading2 && "Loading other data!"}</p>
          </div>
        </div>

        <div className="row py-2 flex-wrap"> {/* tbd top write up */}
          <img width="25%" src="https://images.unsplash.com/photo-1559205313-c6b5ba3e8314?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8" />
          <div className="col">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et massa in nunc euismod euismod ac molestie lorem. Suspendisse ut interdum elit. Mauris tempus sed ligula eget maximus. Etiam nisl sapien, egestas ut ullamcorper non, mollis a lacus. Praesent varius ac augue in rhoncus. Vestibulum est ipsum, mattis ut viverra at, ultrices sit amet quam. Praesent lobortis, nibh ut semper imperdiet, purus ligula viverra ligula, lobortis viverra massa augue at justo. Suspendisse ut augue imperdiet, elementum erat a, ullamcorper urna. Curabitur tincidunt consectetur placerat. Vestibulum venenatis mattis nisl, at tempus mauris eleifend sed. Mauris mollis, nisi sit amet finibus condimentum, odio risus ornare dolor, at ultrices nunc turpis in nulla. Nam in maximus urna, vel maximus nisi. Quisque nec mollis mauris, a rutrum ipsum.</p>
            <p>Donec eget vulputate nibh. Vestibulum interdum tincidunt felis, id dapibus leo posuere nec. Phasellus mattis hendrerit neque sit amet vestibulum. In hac habitasse platea dictumst. Maecenas quis aliquam risus. Praesent id libero quis odio blandit aliquam at vel nisi. Mauris semper cursus urna, nec aliquam nisl auctor eget. Ut ultricies mattis libero.</p>
          </div>
        </div>
        <div className="row py-2">
          <div className="col">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis pellentesque pulvinar. Donec aliquam sapien ligula, eu aliquet diam dapibus at. Vivamus vestibulum ultrices molestie. Nullam diam dui, venenatis quis justo id, tempus condimentum arcu. Donec vel scelerisque nisl. Sed condimentum risus nec arcu posuere tempus. Nunc nec dapibus purus, ac facilisis enim. Integer semper dolor in magna egestas, vitae maximus arcu fermentum.</p>
            <p>Duis nulla quam, ornare at fringilla in, vulputate non metus. Morbi sit amet viverra lectus. Vivamus dapibus id lacus eget posuere. Maecenas consectetur arcu laoreet lacus bibendum, ac elementum libero lobortis. In consequat mauris vitae laoreet condimentum. Nullam sodales, orci quis imperdiet lacinia, risus est mattis nisi, ac fringilla dolor risus vel magna. Morbi lobortis dictum sapien non imperdiet. Quisque ac volutpat ante. Curabitur non tristique enim, ac blandit felis. Vivamus sit amet elit leo. Maecenas scelerisque, sapien quis tincidunt cursus, nulla arcu bibendum mi, ac posuere velit diam et purus. Donec vel laoreet nisl, ac finibus massa.</p>
          </div>
          <img width="200" src="https://cdn.pixabay.com/photo/2019/10/23/06/56/avocado-4570642_1280.png" />
        </div>

        <div className="row p-3 bg-white mb-3" style={{ borderRadius: "30px" }}> {/* dashboard area */}
          <div className="col">
            <div className="row justify-content-center text-center"> {/* filters row */}
              <div className="col-7"> {/* slider col */}
                <h4 className="mb-0">Change Which Year Is Displayed:</h4>
                <div> {/* slider wrapper */}
                  <Slider
                    value={selectedYear - d3.min(years)}
                    min={0}
                    max={5}
                    labels={years}
                    tooltip={false}
                    orientation="horizontal"
                    onChange={value => { setSelectedYear(value + d3.min(years)) }}
                  />
                </div>
              </div>
              <div className="col-5"> {/* tbd size radio btns col */}
                <h4 className="mb-0">Change Which Size Of Avocado Is Displayed:</h4>
                <div className="py-3">
                  <div className="form-check form-check-inline" onChange={this.handleSizeChange}>
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="4046" onChange={this.handleSizeChange} checked={selectedSize === "4046"} />
                    <label className="form-check-label" for="inlineRadio1">Small/Medium</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="4225" onChange={this.handleSizeChange} checked={selectedSize === "4225"} />
                    <label className="form-check-label" for="inlineRadio2">Large</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="4770" onChange={this.handleSizeChange} checked={selectedSize === "4770"} />
                    <label className="form-check-label" for="inlineRadio3">Extra Large</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="total_volume" onChange={this.handleSizeChange} checked={selectedSize === "total_volume"} />
                    <label className="form-check-label" for="inlineRadio4">Any Size</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="row py-3"> {/* map / list row */}
              <div className="col"> {/* map col */}
                <svg id="map" className="tooltip-svg" width={1000} height={600} style={{ border: "1px solid black" }} viewBox={`${x} ${y} ${width} ${height}`}>
                  <path d={mapPathString} fill="rgb(200, 200, 200)" />
                  {
                    // spark ?
                    // Object.keys(groupedData).map((city, i) => {
                    //     const x_scale = x_d3_scale
                    //       .range([2, width - 2])
                    //       .domain(data.length);
                    //     const y_scale = y_d3_scale
                    //       .range([height - 2, 2])
                    //       .domain(d3.extent(groupedData[city][selectedYear]));
                    //     const line = d3.line()
                    //                 .x((d, i) => {
                    //                   return x_scale(i);
                    //                 })
                    //                 .y((d, i) => {
                    //                   return y_scale(d);
                    //                 });
                    //     // console.log(line(groupedData[city][selectedYear]))
                    //     return (
                    //       <svg width={width} height={height} transform={`translate(
                    //           ${projection([groupedData[city].longitude, groupedData[city].latitude])})`}>
                    //         <path
                    //           style={{ fill: 'none', strokeWidth: '0.5px', stroke: 'steelblue' }}/>
                    //       </svg>
                    //     );
                    // }) :
                    avo_agg_data.filter(item => item.year == selectedYear).map(measurement => {
                      return (
                        <circle
                          className="tooltip-trigger"
                          key={measurement.latitude}
                          transform={`translate(${projection([measurement.longitude, measurement.latitude])})`}
                          r={this.setRadius(measurement)}
                          opacity="0.5"
                          fill="#Dd3815"
                          stroke="8E2914"
                          strokeWidth="0.1"
                        />
                      );
                    })
                  }
                  {avo_agg_data.filter(item => item.year == selectedYear).map(measurement => {
                    return (
                      // <g className="tooltip exact">
                      <g key={measurement.latitude}>
                        {/* <rect x="-3em" y="-45" width="6em" height="1.25em"  */}
                        {/* <rect id="tooltip" x="-0.5em" y="-0.5em" width="2em" height="1em" fill="#007bbf" */}
                        {/* visibility="hidden" opacity="0.75" */}
                        {/* transform={`translate(${projection([measurement.longitude, measurement.latitude])})`}> */}
                        <text id="tooltip" className={measurement.city} x="10" y="10" visibility="hidden"
                        transform={`translate(${projection([measurement.longitude, measurement.latitude])})`}>{measurement.city}</text>
                        
                        {/* <text y="-45" dy="1em" textAnchor="middle" */}
                        {/* transform={`translate(${projection([measurement.longitude, measurement.latitude])})`}> */}
                          {/* City: {measurement.city} */}
                          {/* State: {measurement.state_id} */}
                          {/* Sale Amount: ${measurement.total_volume} */}
                        {/* </text> */}
                        {/* </rect> */}
                      </g>
                    );
                  })}
                  {/* {data.filter(item => item.year == selectedYear).map((measurement) => {
                    return (
                      // <div>
                      <circle
                        transform={`translate(
                            ${projection([measurement.longitude, measurement.latitude])})`}
                        r={measurement.total_volume / 1000000}
                        opacity="0.1"
                        fill="#Dd3815"
                        stroke="8E2914"
                        strokeWidth="0.1"
                      />
                      // TODO Get the tooltip to render alongside each centroid
                      // CSS will make the tooltip only visible when scrolled over
                      // <g class="tooltip css">
                        // <rect x="-3em" y="-45" width="6em" height="1.25em" />
                        // <text y="-45" dy="1em" text-anchor="middle">
                        // <text y="-45" dy="1em" textAnchor="middle">
                          // City: {measurement.city}
                          // State: {measurement.state_id}
                          // Sale Amount: ${measurement.total_volume}
                        // </text>
                      // </g>
                      // </div>
                    );
                  })} */}
                </svg>
                {/* zoom overlay, needs nesting to properly stack in corner */}
                <div className="row text-center no-gutters" style={{ position: "absolute", top: "10px", right: "20px" }}>
                  <div className="col">
                    <div className="row">
                      <div className="col">
                        <AiFillPlusCircle className="mx-2" size="30" onClick={() => {
                          setWidth(width <= min_width + 20 ? min_width : width - 20)
                          setHeight(height <= min_height + 3 ? min_height : height - 3)
                        }} />
                        <AiFillMinusCircle className="mx-2" size="30" onClick={() => {
                          setWidth(width >= max_width ? max_width : width + 20)
                          setHeight(height >= max_height ? max_height : height + 3)
                        }} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <AiFillCaretUp size="30" onClick={() => { setY(y - 5) }} />
                        <div className="row">
                          <div className="col"><AiFillCaretLeft size="30" onClick={() => { setX(x - 10) }} /></div>
                          <div className="col"><AiFillCaretRight size="30" onClick={() => { setX(x + 10) }} /></div>
                        </div>
                        <AiFillCaretDown size="30" onClick={() => { setY(y + 5) }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <h4>Top Cities:</h4>
                {listData[0] &&
                <ol>
                  <li id="city-1" className="animate__animated animate__lightSpeedInRight">{listData[0].city}</li>
                  <li id="city-2" className="animate__animated animate__lightSpeedInRight">{listData[1].city}</li>
                  <li id="city-3" className="animate__animated animate__lightSpeedInRight">{listData[2].city}</li>
                  <li id="city-4" className="animate__animated animate__lightSpeedInRight">{listData[3].city}</li>
                  <li id="city-5" className="animate__animated animate__lightSpeedInRight">{listData[4].city}</li>
                  <li id="city-6" className="animate__animated animate__lightSpeedInRight">{listData[5].city}</li>
                  <li id="city-7" className="animate__animated animate__lightSpeedInRight">{listData[6].city}</li>
                  <li id="city-8" className="animate__animated animate__lightSpeedInRight">{listData[7].city}</li>
                  <li id="city-9" className="animate__animated animate__lightSpeedInRight">{listData[8].city}</li>
                  <li id="city-10" className="animate__animated animate__lightSpeedInRight">{listData[9].city}</li>
                </ol>}
                <hr></hr>
                <p>Could put something here</p>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <table className="table table-striped table-sm mb-0">
                  <caption>List of top cities and sale amounts</caption>
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">City</th>
                      <th scope="col">State</th>
                      <th scope="col">Total Sales (USD)</th>
                      <th scope="col">Small/Medium Avocado Sales (USD)</th>
                      <th scope="col">Large Avocado Sales (USD)</th>
                      <th scope="col">Extra Large Avocado Sales (USD)</th>
                    </tr>
                  </thead>
                  {listData[0] &&
                  <tbody>
                    <tr>
                      <th scope="row">1</th>
                      <td>{tableData[0].city}</td>
                      <td>{tableData[0].state_id}</td>
                      <td>{currency.format(tableData[0].total_volume)}</td>
                      <td>{currency.format(tableData[0].sm_4046)}</td>
                      <td>{currency.format(tableData[0].l_4225)}</td>
                      <td>{currency.format(tableData[0].xl_4770)}</td>
                    </tr>
                    <tr>
                      <th scope="row">2</th>
                      <td>{tableData[1].city}</td>
                      <td>{tableData[1].state_id}</td>
                      <td>{currency.format(tableData[1].total_volume)}</td>
                      <td>{currency.format(tableData[1].sm_4046)}</td>
                      <td>{currency.format(tableData[1].l_4225)}</td>
                      <td>{currency.format(tableData[1].xl_4770)}</td>
                    </tr>
                    <tr>
                      <th scope="row">3</th>
                      <td>{tableData[2].city}</td>
                      <td>{tableData[2].state_id}</td>
                      <td>{currency.format(tableData[2].total_volume)}</td>
                      <td>{currency.format(tableData[2].sm_4046)}</td>
                      <td>{currency.format(tableData[2].l_4225)}</td>
                      <td>{currency.format(tableData[2].xl_4770)}</td>
                    </tr>
                    <tr>
                      <th scope="row">4</th>
                      <td>{tableData[3].city}</td>
                      <td>{tableData[3].state_id}</td>
                      <td>{currency.format(tableData[3].total_volume)}</td>
                      <td>{currency.format(tableData[3].sm_4046)}</td>
                      <td>{currency.format(tableData[3].l_4225)}</td>
                      <td>{currency.format(tableData[3].xl_4770)}</td>
                    </tr>
                    <tr>
                      <th scope="row">5</th>
                      <td>{tableData[4].city}</td>
                      <td>{tableData[4].state_id}</td>
                      <td>{currency.format(tableData[4].total_volume)}</td>
                      <td>{currency.format(tableData[4].sm_4046)}</td>
                      <td>{currency.format(tableData[4].l_4225)}</td>
                      <td>{currency.format(tableData[4].xl_4770)}</td>
                    </tr>
                    <tr>
                      <th scope="row">6</th>
                      <td>{tableData[5].city}</td>
                      <td>{tableData[5].state_id}</td>
                      <td>{currency.format(tableData[5].total_volume)}</td>
                      <td>{currency.format(tableData[5].sm_4046)}</td>
                      <td>{currency.format(tableData[5].l_4225)}</td>
                      <td>{currency.format(tableData[5].xl_4770)}</td>
                    </tr>
                    <tr>
                      <th scope="row">7</th>
                      <td>{tableData[6].city}</td>
                      <td>{tableData[6].state_id}</td>
                      <td>{currency.format(tableData[6].total_volume)}</td>
                      <td>{currency.format(tableData[6].sm_4046)}</td>
                      <td>{currency.format(tableData[6].l_4225)}</td>
                      <td>{currency.format(tableData[6].xl_4770)}</td>
                    </tr>
                    <tr>
                      <th scope="row">8</th>
                      <td>{tableData[7].city}</td>
                      <td>{tableData[7].state_id}</td>
                      <td>{currency.format(tableData[7].total_volume)}</td>
                      <td>{currency.format(tableData[7].sm_4046)}</td>
                      <td>{currency.format(tableData[7].l_4225)}</td>
                      <td>{currency.format(tableData[7].xl_4770)}</td>
                    </tr>
                    <tr>
                      <th scope="row">9</th>
                      <td>{tableData[8].city}</td>
                      <td>{tableData[8].state_id}</td>
                      <td>{currency.format(tableData[8].total_volume)}</td>
                      <td>{currency.format(tableData[8].sm_4046)}</td>
                      <td>{currency.format(tableData[8].l_4225)}</td>
                      <td>{currency.format(tableData[8].xl_4770)}</td>
                    </tr>
                    <tr>
                      <th scope="row">10</th>
                      <td>{tableData[9].city}</td>
                      <td>{tableData[9].state_id}</td>
                      <td>{currency.format(tableData[9].total_volume)}</td>
                      <td>{currency.format(tableData[9].sm_4046)}</td>
                      <td>{currency.format(tableData[9].l_4225)}</td>
                      <td>{currency.format(tableData[9].xl_4770)}</td>
                    </tr>
                  </tbody>}
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="row no-gutters"> {/* tbd bottom write up */}
          <div className="col-4">
            <img width="400" src="https://images.unsplash.com/photo-1554825203-68321ddde262?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8" />
          </div>
          <div className="col-8">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis pellentesque pulvinar. Donec aliquam sapien ligula, eu aliquet diam dapibus at. Vivamus vestibulum ultrices molestie. Nullam diam dui, venenatis quis justo id, tempus condimentum arcu. Donec vel scelerisque nisl. Sed condimentum risus nec arcu posuere tempus. Nunc nec dapibus purus, ac facilisis enim. Integer semper dolor in magna egestas, vitae maximus arcu fermentum.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Assignment4;
