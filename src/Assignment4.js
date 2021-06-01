import React, { useEffect, useState } from 'react';
import { useFetch } from "./hooks/useFetch";
import { AiFillPlusCircle, AiFillMinusCircle, AiFillCaretLeft, AiFillCaretDown, AiFillCaretUp, AiFillCaretRight } from "react-icons/ai";
import * as topojson from "topojson-client";
import world from "./land-50m";
import Slider from 'react-rangeslider'
import "react-rangeslider/lib/index.css";

/*
* The skeleton for the map was implemented using the documentation for D3's Bubble Map
* https://observablehq.com/@d3/bubble-map
*/

function Assignment4() {

  const [data, loading] = useFetch(
    "https://raw.githubusercontent.com/ZachGrande/info474-react-parcel-template/master/avocado-2020-joined-city-only.csv"
  );

  const [avo_agg_data, loading2] = useFetch(
    "https://raw.githubusercontent.com/ZachGrande/info474-react-parcel-template/master/aggregated-avocado-2020.csv"
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

  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(25)
  const [x, setX] = useState(90);
  const [y, setY] = useState(100);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2015)
  const [selectedSize, setSelectedSize] = useState("total_volume")


  useEffect(() => {
    if (avo_agg_data) {
      getYears()
    }
  }, [avo_agg_data])

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
    console.log(event.target.value)
    let returnSize = event.target.value
    setSelectedSize(returnSize)
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
                <svg id="map" width={1000} height={600} style={{ border: "1px solid black" }} viewBox={`${x} ${y} ${width} ${height}`}>
                  <path d={mapPathString} fill="rgb(200, 200, 200)" />
                  {avo_agg_data.filter(item => item.year == selectedYear).map((measurement) => {
                    let filterRadius = measurement.total_volume / 1000000
                    if (selectedSize === "4046") {
                      // filterRadius = measurement.sm_4046 / 1000000
                      console.log(measurement.sm_4046)
                    } else if (selectedSize === "4225") {
                      // filterRadius = measurement.l_4225 / 1000000
                      console.log(measurement.l_4225 )
                    } else if (selectedSize === "4770") {
                      // filterRadius = measurement.xl_4770 / 1000000
                      console.log(measurement.xl_4770 )
                    } else {
                      console.log(measurement)
                    }
                    return (
                      <circle
                        transform={`translate(${projection([measurement.longitude, measurement.latitude])})`}
                        r={filterRadius}
                        opacity="0.1"
                        fill="#Dd3815"
                        stroke="8E2914"
                        strokeWidth="0.1"
                      />
                    );
                  })}
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
              <div className="col"> {/* tbd list col */}
                <h4>Top Cities:</h4>
                <ol>
                  <li id="city-1">Seattle</li>
                  <li id="city-2">San Fransisco</li>
                  <li id="city-3">San Diego</li>
                  <li id="city-4">Atlanta</li>
                  <li id="city-5">Miami</li>
                  <li id="city-6">New York</li>
                  <li id="city-7">Houston</li>
                  <li id="city-8">Baltimore</li>
                  <li id="city-9">Charlotte</li>
                  <li id="city-10">Albany</li>
                </ol>
                <hr></hr>
                <p>Could put something here</p>
              </div>
            </div>
            <div className="row"> {/* tbd table / graph row */}
              <div className="col"> {/* tbd table col */}
                <table class="table table-striped table-sm mb-0">
                  <caption>List of top cities and sale amounts</caption>
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">City</th>
                      <th scope="col">State</th>
                      <th scope="col">Sales ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">1</th>
                      <td>Seattle</td>
                      <td>Washington</td>
                      <td>{"$ " + "1000"}</td>
                    </tr>
                    <tr>
                      <th scope="row">2</th>
                      <td>San Fransisco</td>
                      <td>California</td>
                      <td>{"$ " + "1000"}</td>
                    </tr>
                    <tr>
                      <th scope="row">3</th>
                      <td>San Diego</td>
                      <td>California</td>
                      <td>{"$ " + "1000"}</td>
                    </tr>
                    <tr>
                      <th scope="row">4</th>
                      <td>Atlanta</td>
                      <td>Georgia</td>
                      <td>{"$ " + "1000"}</td>
                    </tr>
                    <tr>
                      <th scope="row">5</th>
                      <td>Miami</td>
                      <td>Florida</td>
                      <td>{"$ " + "1000"}</td>
                    </tr>
                    <tr>
                      <th scope="row">6</th>
                      <td>New York</td>
                      <td>New York</td>
                      <td>{"$ " + "1000"}</td>
                    </tr>
                    <tr>
                      <th scope="row">7</th>
                      <td>Houston</td>
                      <td>the Bird</td>
                      <td>{"$ " + "1000"}</td>
                    </tr>
                    <tr>
                      <th scope="row">8</th>
                      <td>Baltimore</td>
                      <td>Maryland</td>
                      <td>{"$ " + "1000"}</td>
                    </tr>
                    <tr>
                      <th scope="row">9</th>
                      <td>Charlotte</td>
                      <td>North Carolina</td>
                      <td>{"$ " + "1000"}</td>
                    </tr>
                    <tr>
                      <th scope="row">10</th>
                      <td>Albany</td>
                      <td>New York</td>
                      <td>{"$ " + "1000"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col"> {/* tbd graph col */}
                <div className="bg-warning h-100">d3 graph</div>
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
