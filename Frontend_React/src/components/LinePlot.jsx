import {
  incomePercentile_female as data2,
  incomePercentile_male as data1,
} from "./Data.js";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export const LinePlot = ({ sex, incomee, isMax }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const updateData = useRef(null);
  const zoomData = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const svgRef = useRef();
  const margin = { top: 40, right: 30, bottom: 20, left: 25 };
  const [currentData, setCurrentData] = useState(data1); // Initialize with data1

  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const xAxis = d3.axisBottom().scale(x);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .attr("class", "myXaxis")
      .style("color", sex === "Male" ? "#eef7ff" : "#d7ffee");

    const xLabel = svg
      .append("text")
      .style("font-size", width < 600 ? "0.66rem" : "1rem")
      .attr(
        "transform",
        `translate(${width < 600 ? width + 7 : width + 12}, ${
          width < 600 ? height : height - 7
        }) rotate(90)`,
      )
      .style("text-anchor", "end")
      .style("font-style", "italic")
      .style("fill", sex === "Male" ? "#eef7ff" : "#d7ffee")
      .text("Percentile")
      .attr("filter", "url(#glow4)");

    const y = d3.scaleLinear().range([height, 0]);
    const yAxis = d3
      .axisLeft()
      .scale(y)
      .ticks(width < 600 ? 2 : 5)
      .tickFormat(d3.format(".2s"))
      .tickSize(-width)
      .tickSizeOuter(0);
    svg
      .append("g")
      .attr("class", "myYaxis")
      .style("color", sex === "Male" ? "#eef7ff" : "#d7ffee");

    const yLabel = svg
      .append("text")
      .style("font-size", width < 600 ? "0.66rem" : "1rem")
      .attr("y", -24)
      .attr("x", -20)
      .style("font-style", "italic")
      .style("text-anchor", "start")

      .style("fill", sex === "Male" ? "#eef7ff" : "#d7ffee") // Color for y-axis label
      .text("Income")
      .attr("filter", "url(#glow4)");

    //create series of glows ...............................................................................................................
    var stdDeviationValues = [4.5, 0.25, 0.5, 0.75, 1.25, 1.5, 1.75, 2]; // Example values
    // Create filter definitions with different stdDeviation values
    stdDeviationValues.forEach((stdDeviationValue, index) => {
      var defs = svg.append("defs");
      var filter = defs
        .append("filter")
        .attr("id", index === 0 ? "glow" : "glow" + index); // Add an index to the filter id except for the first one

      filter
        .append("feGaussianBlur")
        .attr("class", "blur")
        .attr("stdDeviation", stdDeviationValue) // Set the stdDeviation value
        .attr("result", "coloredBlur");

      var feMerge = filter.append("feMerge");
      feMerge.append("feMergeNode").attr("in", "coloredBlur");
      feMerge.append("feMergeNode").attr("in", "SourceGraphic");
    });

    zoomData.current = (data, rangeLength) => {
      const exactMatch = data.find((d) => d.income === incomee);
      // If an exact match is found, use it directly; otherwise, find the closest value
      const closestData =
        exactMatch ||
        data.sort(
          (a, b) => Math.abs(a.income - incomee) - Math.abs(b.income - incomee),
        )[0];

      // If no exact match is found, update the income to correspond to the value of income_percentile
      const income = exactMatch ? incomee : closestData.income;

      // Assign the income_percentile value of the closest data point found
      const income_percentile = closestData.income_percentile;

      // Trim the data to the percentile range of +-0.02 percent
      const zoomedData = data.filter((d) => {
        return (
          d.income_percentile >= income_percentile - rangeLength / 2 &&
          d.income_percentile <= income_percentile + rangeLength / 2
        );
      });

      // Update GLowing Point ........................................................................................
      // const glowingPoint = svg.selectAll(".glowing-point").data([closestData]);
      //
      // glowingPoint
      //   .enter()
      //   .append("circle")
      //   .attr("class", "glowing-point")
      //   .attr("r", width < 600 ? 6 : 7)
      //   .attr("fill", "#ff405a")
      //   .attr("filter", "url(#glow)") // Apply the glow filter here
      //   .merge(glowingPoint)
      //   .attr("cx", x(income_percentile))
      //   .attr("cy", y(income));
      //
      // glowingPoint.exit().remove();
      //
      // // Remove any excess elements
      svg
        .selectAll(".arrow-line")
        .transition()
        .duration(1200) // Adjust duration as needed
        .attr("transform", "translate(-1200,0)") // Adjust translation based on your layout
        .remove(); // Remove after transition

      svg
        .selectAll(".arrow-text")
        .transition()
        .duration(500) // Adjust duration as needed
        .attr("x", -100) // Move to the left
        .style("opacity", 0) // Set opacity to 0
        .remove(); // Remove after transition
      // svg.selectAll(".lineTest").remove();

      // Update Axes ...................................................................................................
      // X Axis
      const [minValueX, maxValueX] = d3.extent(
        zoomedData.map((d) => d.income_percentile),
      );
      x.domain([minValueX, maxValueX]);
      const xAxisGroup = svg.selectAll(".myXaxis");
      xAxisGroup
        .transition()
        .duration(1500)
        .call(
          d3
            .axisBottom(x)
            .tickFormat(d3.format(".1%"))
            .ticks(5)
            .tickValues([
              income_percentile - rangeLength / 2,
              income_percentile - rangeLength / 4,
              income_percentile,
              income_percentile + rangeLength / 4,
              maxValueX + rangeLength / 2,
            ]),
        );

      // Y Axis
      y.domain([
        d3.min(zoomedData, (d) => d.income),
        d3.max(zoomedData, (d) => d.income) + 1000,
      ]);
      const yAxisGroup = svg.selectAll(".myYaxis");
      yAxisGroup.transition().duration(1500).call(yAxis);
      yAxisGroup.select("path").attr("stroke", "none");
      yAxisGroup.selectAll("line").style("opacity", "20%");

      var clip = svg
        .append("defs")
        .append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

      // Update Main Line ........................................................................................
      const u = svg.selectAll(".lineTest").data([data], function (d) {
        return d.income_percentile;
      });

      u.join("path")
        .attr("class", "lineTest")
        .attr("clip-path", "url(#clip)")
        .transition()
        .duration(1500)
        .attr("fill", "none")
        .attr("stroke", sex === "Male" ? "#b6eeff" : "#b9ffe7")
        .attr("stroke-width", width < 600 ? 3.8 : 4.5)
        .attr("filter", "url(#glow)") // Apply the glow filter here
        .attr(
          "d",
          d3
            .line()
            .x((d) => x(d.income_percentile))
            .y((d) => y(d.income)),
        );

      const glowingPoint = svg.selectAll(".glowing-point").data([closestData]);

      glowingPoint
        .enter()
        .append("circle")
        .attr("class", "glowing-point")
        .attr("r", width < 600 ? 6 : 7)
        .attr("fill", "#ff405a")
        .attr("filter", "url(#glow)") // Apply the glow filter here
        .merge(glowingPoint)
        .transition()
        .duration(1500) // Adjust animation duration as needed
        .attr("cx", x(income_percentile))
        .attr("cy", y(income));

      glowingPoint.exit().remove();

      // Update Arrow and Text
      // ...
    };
    const updateChart = (data) => {
      // Misc.........................................................................................................
      const [minValueX, maxValueX] = d3.extent(
        data.map((d) => d.income_percentile),
      );

      const exactMatch = data.find((d) => d.income === incomee);
      // If an exact match is found, use it directly; otherwise, find the closest value
      const closestData =
        exactMatch ||
        data.sort(
          (a, b) => Math.abs(a.income - incomee) - Math.abs(b.income - incomee),
        )[0];

      // If no exact match is found, update the income to correspond to the value of income_percentile
      const income = exactMatch ? incomee : closestData.income;

      // Assign the income_percentile value of the closest data point found
      const income_percentile = closestData.income_percentile;

      // Update X Axis and Label .........................................................................
      x.domain([minValueX, 1]);
      const xAxisGroup = svg.selectAll(".myXaxis");

      xAxisGroup
        .transition()
        .duration(1500)
        .call(
          xAxis
            .tickFormat(d3.format(".1%"))
            .ticks(width < 600 ? 2 : 5)
            .tickValues(
              width < 600
                ? [minValueX, maxValueX]
                : [minValueX, 0.2, 0.4, 0.6, 0.8, maxValueX],
            ),
        );

      // Update y Axis and Label .........................................................................
      y.domain([0, d3.max(data, (d) => d.income) + 1000]);

      const yAxisGroup = svg.selectAll(".myYaxis");
      yAxisGroup.transition().duration(1500).call(yAxis);
      yAxisGroup.select("path").attr("stroke", "none");
      yAxisGroup.selectAll("line").style("opacity", "20%");

      // Update Main Line ........................................................................................
      const u = svg.selectAll(".lineTest").data([data], function (d) {
        return d.income_percentile;
      });

      u.join("path")
        .attr("class", "lineTest")
        .transition()
        .duration(1500)
        .attr("fill", "none")
        .attr("stroke", sex === "Male" ? "#b6eeff" : "#b9ffe7")
        .attr("stroke-width", width < 600 ? 2.8 : 3.5)
        .attr("filter", "url(#glow)") // Apply the glow filter here
        .attr(
          "d",
          d3
            .line()
            .x((d) => x(d.income_percentile))
            .y((d) => y(d.income)),
        );
      // Update GLowing Point ........................................................................................
      const glowingPoint = svg.selectAll(".glowing-point").data([closestData]);

      glowingPoint
        .enter()
        .append("circle")
        .attr("class", "glowing-point")
        .attr("r", width < 600 ? 6 : 7)
        .attr("fill", "#ff405a")
        .attr("filter", "url(#glow)") // Apply the glow filter here
        .merge(glowingPoint)
        .transition()
        .duration(1500) // Adjust animation duration as needed
        .attr("cx", x(income_percentile))
        .attr("cy", y(income));

      glowingPoint.exit().remove();

      // ......................................................................................................
      // Define arrow properties...
      const arrowLength = height * 0.4; // Define your desired length
      const padding = 10; // Define padding between arrowhead and point
      const angle =
        income_percentile < 0.1
          ? 150
          : income_percentile < 0.2
            ? 140
            : income_percentile < 0.3
              ? 130
              : income_percentile < 0.4
                ? 120
                : income_percentile < 0.5
                  ? 110
                  : income_percentile < 0.6
                    ? 100
                    : income_percentile < 0.7
                      ? 71
                      : income_percentile < 0.8
                        ? 40
                        : income_percentile < 0.9
                          ? 30
                          : income_percentile < 0.96
                            ? 15
                            : income_percentile < 0.98
                              ? 5
                              : -5;
      // Define angle of the line (in degrees)

      // Calculate coordinates of the arrow
      const dx = arrowLength * Math.cos((angle * Math.PI) / 180);
      const dy = arrowLength * Math.sin((angle * Math.PI) / 180);

      const arrowX2 = x(income_percentile); // x-coordinate of the point
      const arrowY2 = y(income); // y-coordinate of the point
      const arrowX1 = arrowX2 - dx; // x-coordinate of the arrow
      const arrowY1 = arrowY2 - dy; // y-coordinate of the arrow tip

      // Adjust coordinates based on padding
      const length = Math.sqrt(dx * dx + dy * dy);
      const padX = (dx / length) * padding;
      const padY = (dy / length) * padding;

      const arrowX1Padded = arrowX1 + padX;
      const arrowY1Padded = arrowY1 + padY;

      // Append a line element representing the arrow
      const arrow_line = svg.selectAll(".arrow-line").data([closestData]);

      arrow_line
        .enter()
        .append("line")
        .attr("class", "arrow-line")
        .attr("stroke", "#ff405a")
        .attr("stroke-dasharray", "3")
        .attr("filter", "url(#glow)") // Apply the glow filter here
        .merge(arrow_line)
        .transition()
        .duration(1500) // Adjust animation duration as needed
        .attr("x1", arrowX1Padded)
        .attr("y1", arrowY1Padded)
        .attr("x2", arrowX2)
        .attr("y2", arrowY2);

      // Remove any excess elements
      arrow_line.exit().remove();

      // Append a text element representing the arrow text
      const arrow_text = svg.selectAll(".arrow-text").data([closestData]);

      arrow_text
        .enter()
        .append("text")
        .attr("class", "arrow-text")
        .attr("x", arrowX1)
        .attr("y", arrowY1)
        .attr("dy", "-0.5em")
        .attr(
          "text-anchor",
          income_percentile < 0.2
            ? "start"
            : income_percentile < 0.9
              ? "middle"
              : "end",
        )
        .style("fill", sex === "Male" ? "#b6eeff" : "#b9ffe7")
        .style("font-size", width < 600 ? "0.64rem" : "0.82rem")
        .style("letter-spacing", "0.07em")

        .attr("filter", "url(#glow1)")
        .style("transform", "scale(0)")
        .merge(arrow_text)
        .transition()
        .duration(2000) // Adjust animation duration as needed
        .style("transform", "scale(1)")
        .attr("x", arrowX1)
        .attr("y", arrowY1)
        .text(
          isMax
            ? `${Math.round(income_percentile * 10000) / 100}% make ≤ ${
                income / 1000
              }k annually`
            : `${Math.round((1 - income_percentile) * 10000) / 100}% make > ${
                income / 1000
              }k annually`,
        );

      // Remove any excess elements
      arrow_text.exit().remove();
    };
    updateData.current = updateChart;
    updateChart(currentData);

    // Clean up
    return () => {
      svg.selectAll("*").remove();
    };
  }, [dimensions, incomee, isMax]);

  useEffect(() => {
    const handleResize = () => {
      const svgNode = svgRef.current.parentNode;
      const { width, height } = svgNode.getBoundingClientRect();
      setDimensions({ width, height });
    };

    // Initial resize
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleUpdate = () => {
    if (currentData === data1) {
      updateData.current(data2);
      setCurrentData(data2);
    } else {
      updateData.current(data1);
      setCurrentData(data1);
    }
  };
  console.log(dimensions.height, dimensions.width);

  return (
    <>
      <button
        className="fixed top-20 h-12 w-32 bg-slate-950 text-base"
        onClick={() => {
          !isZoomed
            ? (zoomData.current(currentData, 0.16), setIsZoomed(true))
            : (updateData.current(currentData), setIsZoomed(false));
        }}
      >
        Zoom
      </button>
      <button
        className="fixed left-80 top-20 h-12 w-32 bg-slate-950 text-base"
        onClick={() => handleUpdate()}
      >
        {currentData === data1 ? "See for  Female" : "See for Male"}
      </button>
      <svg ref={svgRef}></svg>
    </>
  );
};
