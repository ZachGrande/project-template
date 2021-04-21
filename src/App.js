import React from "react";
import { useFetch } from "./hooks/useFetch";
import { scaleLinear } from "d3-scale";
import { extent, max, min } from "d3-array";

const viewHeight = 500;
const viewWidth = 500;

const App = () => {

    const [data, loading] = useFetch(
        // "https://raw.githubusercontent.com/ZachGrande/info474-react-parcel-template/master/disney_movies.csv"
        "https://raw.githubusercontent.com/colinmegill/react-parcel-starter/main/weather.csv"
        // "https://raw.githubusercontent.com/ZachGrande/info474-react-parcel-template/master/netflix_titles.csv"
    );

    console.log("from hook", loading, data);

    const dataSmallSample = data.slice(0, 300);
    const TMAXextent = extent(dataSmallSample, (d) => {
        return +d.TMAX;
    });
    console.log(TMAXextent);
    const size = 500;
    const margin = 20;
    const axisTextAlignmentFactor = 3;
    const yScale = scaleLinear()
        .domain(TMAXextent) // unit: km
        .range([size - margin, size - 350]); // unit: pixels
    return (
        <div>
            <h1>Exploratory Data Analysis, Assignment 2, INFO 474 SP 2021</h1>
            <p>{loading && "Loading data!"}</p>
            <h3>Scales in D3</h3>
            <svg width={size} height={size} style={{ border: "1px solid black" }}>
                <text
                    x={size / 2 - 12}
                    y={yScale(0) + axisTextAlignmentFactor}
                    textAnchor="end"
                    style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
                >
                    0
                </text>
                <text
                    x={size / 2 - 12}
                    y={yScale(100) + axisTextAlignmentFactor}
                    textAnchor="end"
                    style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
                >
                    100
                </text>
                <line
                    x1={size / 2 - 10}
                    y1={yScale(100)}
                    x2={size / 2 - 5}
                    y2={yScale(100)}
                    stroke={"black"}
                />
                <line
                    x1={size / 2 - 10}
                    y1={yScale(0)}
                    x2={size / 2 - 5}
                    y2={yScale(0)}
                    stroke={"black"}
                />
                {dataSmallSample.map((measurement, index) => {
                    const highlight = measurement.station === "KALISPELL GLACIER AP";
                    return (
                        <line
                            key={index}
                            x1={size / 2}
                            y1={yScale(measurement.TMAX)}
                            x2={size / 2 + 20}
                            y2={yScale(measurement.TMAX)}
                            stroke={highlight ? "red" : "steelblue"}
                            strokeOpacity={highlight ? 1 : 0.1}
                        />
                    );
                })}
            </svg>
            <h3>Scatterplot</h3>
            <svg width={size} height={size} style={{ border: "1px solid black" }}>
                {dataSmallSample.map((measurement, index) => {
                    const highlight = measurement.station === "KALISPELL GLACIER AP";
                    return (
                        <circle
                            key={index}
                            cx={100 - measurement.TMIN}
                            cy={size - margin - measurement.TMAX}
                            r="3"
                            fill="none"
                            stroke={highlight ? "red" : "steelblue"}
                            strokeOpacity="0.2"
                        />
                    );
                })}
            </svg>
            <h3>
                Barcode plot TMAX at Kalispell Glacier (sounds cold, expect it to be
                lower than average)
            </h3>
            <svg width={size} height={size} style={{ border: "1px solid black" }}>
                <text
                    x={size / 2 - 12}
                    textAnchor="end"
                    y={size - margin + axisTextAlignmentFactor}
                    style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
                >
                    0
                </text>
                <text
                    x={size / 2 - 12}
                    textAnchor="end"
                    y={size - margin - 100 + axisTextAlignmentFactor}
                    style={{ fontSize: 10, fontFamily: "Gill Sans, sans serif" }}
                >
                    100
                </text>
                <line
                    x1={size / 2 - 10}
                    y1={size - margin - 100}
                    x2={size / 2 - 5}
                    y2={size - margin - 100}
                    stroke={"black"}
                />
                <line
                    x1={size / 2 - 10}
                    y1={size - margin}
                    x2={size / 2 - 5}
                    y2={size - margin}
                    stroke={"black"}
                />
                {data.slice(0, 1000).map((measurement, index) => {
                    const highlight = measurement.station === "KALISPELL GLACIER AP";
                    return (
                        <line
                            key={index}
                            x1={size / 2}
                            y1={size - margin - measurement.TMAX}
                            x2={size / 2 + 20}
                            y2={size - margin - measurement.TMAX}
                            stroke={highlight ? "red" : "steelblue"}
                            strokeOpacity={highlight ? 1 : 0.1}
                        />
                    );
                })}
            </svg>
            <h3>
                TMAX at Kalispell Glacier (sounds cold, expect it to be lower than
                average)
            </h3>
            <svg width={size} height={size} style={{ border: "1px solid black" }}>
                {data.slice(0, 300).map((measurement, index) => {
                    const highlight = measurement.station === "KALISPELL GLACIER AP";
                    return (
                        <circle
                            key={index}
                            cx={highlight ? size / 2 : size / 2 - 20}
                            cy={size - margin - measurement.TMAX}
                            r="3"
                            fill="none"
                            stroke={highlight ? "red" : "steelblue"}
                            strokeOpacity="0.2"
                        />
                    );
                })}
            </svg>
            <h3>Rendering circles :) this shows a distribution of TMAX</h3>
            <svg width={size} height={size} style={{ border: "1px solid black" }}>
                {data.slice(0, 300).map((measurement, index) => {
                    return (
                        <circle
                            key={index}
                            cx={size / 2}
                            cy={size - margin - measurement.TMAX}
                            r="3"
                            fill="none"
                            stroke={"steelblue"}
                            strokeOpacity="0.2"
                        />
                    );
                })}
            </svg>
        </div>
    );

    // return <svg style={{border: "1px solid lightgrey", width: viewWidth, height: viewHeight}}>
    //     <circle cx={0} cy={viewHeight} r="5" />
    //     <rect x="200" y="100" width="10" height="10" />
    //     <rect x={200} y={200} width={10} height={10} fill="rgb(230,230,230)" />
    //     <rect x={212} y={200} width={10} height={10} fill="rgb(230,230,230)" />
    //     <rect x={224} y={200} width={10} height={10} fill="rgb(230,230,230)" />
    //     <rect x={236} y={200} width={10} height={10} fill="rgb(230,230,230)" />
    //     <rect x={248} y={200} width={10} height={10} />
    //     <line x1="20" y1={viewHeight - 50} x2="150" y2="100" stroke="black" />
    //     <text x="20" y="35" class="small" style={{font: "italic 13px sans- serif"}}>
    //         Price history of 100 randomly selected Pokemon cards
    //         Changed the name of the repo
    //     </text>
    // </svg>;
    // return <div>Hello from react</div>;
};

export default App;
