import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { incomePercentile_male, incomePercentile_female } from "./Data.js";
const LineChart = ({ data, sex, incomee, isMax }) => {
  const logInputRef = useRef(null);
  // Check if an exact match for the income value exists in the data
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

  const [minValueX, maxValueX] = d3.extent(
    data.map((d) => d.income_percentile),
  );
  const svgRef = useRef();
  const [size, setSize] = useState({ width: null, height: null });
  const margin = { top: 40, right: 30, bottom: 20, left: 20 };

  useEffect(() => {
    const containerWidth =
      svgRef.current.parentElement.clientWidth -
      parseFloat(getComputedStyle(svgRef.current.parentElement).paddingLeft) -
      parseFloat(getComputedStyle(svgRef.current.parentElement).paddingRight);

    const containerHeight =
      svgRef.current.parentElement.clientHeight -
      parseFloat(getComputedStyle(svgRef.current.parentElement).paddingTop) -
      parseFloat(getComputedStyle(svgRef.current.parentElement).paddingBottom);
    console.log(containerWidth, containerHeight);
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleLinear().domain([minValueX, 1]).range([0, width]);
    const xAxis = svg
      .append("g")
      .attr("class", "myXaxis")
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(width < 600 ? 2 : 5)
          .tickFormat(d3.format(".1%"))
          .tickValues(
            width < 600
              ? [minValueX, maxValueX]
              : [minValueX, 0.2, 0.4, 0.6, 0.8, maxValueX],
          ),
      );
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.income) + 1000])
      .range([height, 0]);
    // Filter data for the specific x range (0-0.97)

    const yAxis = svg
      .append("g")
      .attr("class", "myYaxis")
      .call(
        d3
          .axisLeft(y)
          .ticks(width < 600 ? 2 : 5)
          .tickFormat(d3.format(".2s"))
          .tickSize(-width)
          .tickSizeOuter(0),
      );

    xAxis
      .selectAll("text")
      .attr("fill", sex === "Male" ? "#eef7ff" : "#d7ffee");

    xAxis
      .selectAll("line")
      .attr("stroke", sex === "Male" ? "#eef7ff" : "#d7ffee");
    xAxis.select("path").attr("stroke", sex === "Male" ? "#eef7ff" : "#d7ffee");
    yAxis
      .selectAll("text")
      .attr("fill", sex === "Male" ? "#eef7ff" : "#d7ffee")
      .attr("transform", "translate(5, 0)");
    // yAxis.selectAll("line").attr("stroke", "none");
    yAxis.select("path").attr("stroke", "none");
    yAxis.selectAll("line").style("opacity", "20%");
    yAxis.selectAll("line").style("color", "#EDC951");

    const horizontalLine = svg
      .append("line")
      .attr("x1", x(income_percentile)) // Start at income percentile
      .attr("y1", y(0)) // Bottom of the plot
      .attr("x2", isMax ? 0 : width) // Right end of the plot
      .attr("y2", y(0)) // Bottom of the plot
      .attr("stroke", sex === "Male" ? "#BC4045" : "#ff405a") // Red color
      .attr("stroke-width", 2);

    const horizontalLine2 = svg
      .append("line")
      .attr("stroke", "grey")
      .attr("stroke-width", 1.5)
      .style("stroke-dasharray", "3")
      .attr("x1", x(income_percentile))
      .attr("y1", y(income))
      .attr("x2", x(income_percentile))
      .attr("y2", y(income));

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
    const arrow_line = svg
      .append("line")
      .style("stroke-dasharray", "3")
      .attr("x1", arrowX1Padded)
      .attr("y1", arrowY1Padded)
      .attr("x2", arrowX2)
      .attr("y2", arrowY2)
      .attr("stroke", "#ff405a")
      .attr("filter", "url(#glow7)");

    const arrow_text = svg
      .append("text")
      .attr("x", arrowX1) // Set x-coordinate of the text
      .attr("y", income_percentile < 0.94 ? arrowY1 : arrowY1 + 10) // Set y-coordinate of the text
      .attr("dy", "-0.5em") // Adjust vertical position of the text
      .attr(
        "text-anchor",
        income_percentile < 0.2
          ? "start"
          : income_percentile < 0.9
            ? "middle"
            : "end",
      ) // Set text anchor to middle

      .style("fill", sex === "Male" ? "#b6eeff" : "#b9ffe7")
      .style("font-size", width < 600 ? "0.64rem" : "0.82rem")
      .style("letter-spacing", "0.07em")
      .text(
        isMax
          ? `${Math.round(income_percentile * 10000) / 100}% make ≤ ${
              income / 1000
            }k annually`
          : `${Math.round((1 - income_percentile) * 10000) / 100}% make > ${
              income / 1000
            }k annually`,
      )
      .attr("filter", "url(#glow1)");

    const verticalLine = svg
      .append("line")
      .attr("stroke", sex === "Male" ? "#BC4045" : "#ff405a")
      .attr("stroke-width", 1.5)
      .style("stroke-dasharray", "3")
      .attr("x1", x(income_percentile))
      .attr("y1", y(0))
      .attr("x2", x(income_percentile))
      .attr("y2", y(income));
    const verticalPad = y(0) - 28;

    // const horizontalLine = createLine(
    //   svg,
    //   0,
    //   y(60000),
    //   textXPosition - 20,
    //   y(60000),
    // );
    // Function to create label and rectangle
    function appendLabel(
      container,
      xValue,
      yValue,
      labelText,
      textColor,
      dxValue,
    ) {
      return container
        .append("text")
        .attr("class", "label")
        .attr("x", xValue)
        .attr("y", yValue)
        .style("font-weight", "bold")
        .style("text-anchor", "middle")
        .style("fill", textColor)
        .text(labelText); // Return the text element
    }

    // Vertical line labels
    const verticalLabel = appendLabel(
      xAxis,
      150,
      -500,
      Math.round(income_percentile * 10000) / 100 + " %",
      "#EDC951",
      0,
    );
    xAxis
      .selectAll("text")
      .style("font-size", width < 600 ? "0.6rem" : "0.73rem");
    // Horizontal line label (without x padding)
    // const horizontalLabel = appendLabel(
    //   yAxis,
    //   x(0.82) * 1.06,
    //   y(60000) - 10,
    //   extraXTickLabel,
    //   "#FAF9F6",
    //   30,
    // );
    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg
      .append("defs")
      .append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    // Add brushing
    var brush = d3
      .brushX() // Add the brush feature using the d3.brush function
      .extent([
        [0, 0],
        [width, height],
      ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", ({ selection }) => brushed(selection)); // Each time the brush selection changes, trigger the 'updateChart' function

    var line = svg.append("g").attr("clip-path", "url(#clip)");

    // Define the SVG filter
    // Define standard deviation values for each element
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

    // Append the line with the glow effect
    line
      .append("path")
      .datum(data)
      .attr("class", "line") // I add the class line to be able to modify this line later on.
      .attr("id", "main-line")
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

    const glowingPoint = line
      .append("circle")
      .attr("class", "glowing-point")
      .attr("cx", x(income_percentile))
      .attr("cy", y(income))
      .attr("r", width < 600 ? 6 : 7)
      .attr("fill", "#ff405a")
      .attr("filter", "url(#glow)"); // Apply the glow filter here

    // Add the brushing
    line.append("g").attr("class", "brush").call(brush);

    // Append a title to the plot

    svg
      .append("text")
      .style("font-size", width < 600 ? "0.66rem" : "1rem")
      .attr("y", y(534000))
      .attr("x", -18)
      .style("font-style", "italic")
      .style("text-anchor", "start")

      .style("fill", sex === "Male" ? "#29e7fd" : "#23ffbd") // Color for y-axis label
      .text("Income")
      .attr("filter", "url(#glow4)");

    // Add x-axis label
    const xlabel = svg
      .append("text")
      .style("font-size", width < 600 ? "0.66rem" : "1rem")
      .attr(
        "transform",
        `translate(${width < 600 ? width + 7 : width + 12}, ${
          width < 600 ? height : height - 7
        }) rotate(90)`,
      )
      // Adjust the position inward
      .style("text-anchor", "end")
      .style("font-style", "italic")
      .style("fill", sex === "Male" ? "#29e7fd" : "#23ffbd") // Color for x-axis label
      .text("Percentile")
      .attr("filter", "url(#glow4)"); // Apply glow filter;

    // A function that set idleTimeOut to null
    var idleTimeout;
    function idled() {
      idleTimeout = null;
    }

    function brushed(selection) {
      if (selection === null) {
        if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
        x.domain([0, 1]);
      } else {
        const [startX, endX] = selection;
        const startXValue = x.invert(startX);
        const endXValue = x.invert(endX);

        // Filter data based on the brushed selection
        const newData = data.filter(
          (d) =>
            d.income_percentile >= startXValue - 0.05 &&
            d.income_percentile <= endXValue + 0.05,
        );

        // Update x domain
        x.domain([startXValue, endXValue]);

        // Update y domain based on the filtered data
        const yMax = d3.max(newData, (d) => d.income);
        const yMin = d3.min(newData, (d) => d.income);

        const padding = 0.2 * (yMax - yMin);
        y.domain([yMin - padding, yMax]);

        verticalLine
          .transition() // Add transition
          .duration(250)
          .attr("x1", x(income_percentile))
          .attr("x2", x(income_percentile))
          .attr("y2", y(income))
          .attr("y1", verticalPad);

        horizontalLine2
          .transition() // Add transition
          .duration(250)
          .attr("x2", 0)
          .attr("x1", x(income_percentile))
          .attr("y1", y(income))
          .attr("y2", y(income));

        horizontalLine
          .transition() // Add transition
          .duration(250)
          .attr("x1", isMax ? 0 : width);

        arrow_line
          .transition()
          .duration(300)
          .attr("y1", 0)

          .attr("y2", 0);

        arrow_text.transition().duration(300).attr("y", -50);

        // horizontalLine.attr("y1", y(60000)).attr("y2", y(60000));
        // horizontalLabel.attr("y", y(60000) - 10);
        verticalLabel
          .transition() // Add transition
          .duration(250)
          .attr("x", x(income_percentile))
          .attr("y", -11)
          .text(Math.round(income_percentile * 10000) / 100 + " %");
        // Update the position of the glowing point
        glowingPoint
          .transition() // Add transition
          .duration(600)
          .attr("cx", x(income_percentile))
          .attr("cy", y(income));

        line.select(".brush").call(brush.move, null); // This removes the grey brush area as soon as the selection has been done

        // Update axes and line
        xAxis
          .transition()
          .duration(350)
          .call(
            d3
              .axisBottom(x)
              .ticks(width < 600 ? 2 : 5)
              .tickFormat(d3.format(".2%")),
          );
        yAxis
          .transition()
          .duration(350)
          .call(
            d3
              .axisLeft(y)
              .ticks(width < 600 ? 2 : 5)
              .tickFormat(d3.format(".2s"))
              .tickSize(-width)
              .tickSizeOuter(0),
          );
        line
          .select(".line")
          .datum(newData)
          .transition()
          .duration(500)
          .attr(
            "d",
            d3
              .line()
              .x(function (d) {
                return x(d.income_percentile);
              })
              .y(function (d) {
                return y(d.income);
              }),
          );

        xAxis.selectAll("text").attr("fill", "#d8f3ff");
        xAxis
          .selectAll("text")
          .style("font-size", width < 600 ? "0.6rem" : "0.7rem");
        xAxis
          .selectAll("line")
          .attr("stroke", sex === "Male" ? "#eef7ff" : "#d7ffee");
        xAxis
          .select("path")
          .attr("stroke", sex === "Male" ? "#eef7ff" : "#d7ffee");
        yAxis
          .selectAll("text")
          .attr("fill", sex === "Male" ? "#eef7ff" : "#d7ffee")
          .attr("transform", "translate(5, 0)");
        // yAxis.selectAll("line").attr("stroke", "none");
        yAxis.selectAll("line").style("opacity", "15%");
        yAxis.selectAll("line").style("color", "#EDC951");
        yAxis.select("path").attr("stroke", "none");
      }
    }

    svg.on("dblclick", function () {
      const newXDomain = [minValueX, 1];
      const newData = data.filter(
        (d) =>
          d.income_percentile >= newXDomain[0] &&
          d.income_percentile <= newXDomain[1],
      );

      // Update x domain and axis
      x.domain(newXDomain);
      xAxis.transition().call(
        d3
          .axisBottom(x)
          .ticks(width < 600 ? 2 : 5)
          .tickFormat(d3.format(".1%"))
          .tickValues(
            width < 600
              ? [minValueX, maxValueX]
              : [minValueX, 0.2, 0.4, 0.6, 0.8, maxValueX],
          ),
      );

      // Calculate y domain based on filtered data points closest to the edges of the x-axis range
      const xData = newData.map((d) => d.income_percentile);
      const yData = newData.map((d) => d.income);
      const xExtent = d3.extent(xData);
      const yExtent = d3.extent(
        yData.filter(
          (d, i) => xData[i] >= xExtent[0] && xData[i] <= xExtent[1],
        ),
      );

      // Update y domain with some padding

      const newYDomain = [yExtent[0], yExtent[1]];
      y.domain(newYDomain);
      yAxis.transition().call(
        d3
          .axisLeft(y)
          .ticks(width < 600 ? 2 : 5)
          .tickFormat(d3.format(".2s"))
          .tickSize(-width)
          .tickSizeOuter(0),
      );

      verticalLine
        .transition()
        .duration(250)
        .attr("x1", x(income_percentile))
        .attr("x2", x(income_percentile))
        .attr("y2", y(income))
        .attr("y1", y(0));

      horizontalLine2
        .transition() // Add transition
        .duration(250)
        .attr("x2", x(income_percentile))
        .attr("x1", x(income_percentile));

      horizontalLine
        .transition() // Add transition
        .duration(250)
        .attr("x1", x(income_percentile));

      arrow_line
        .transition()
        .duration(300)
        .attr("y2", arrowY2)
        .transition()
        .duration(300)
        .attr("y1", arrowY1Padded);

      arrow_text
        .transition()
        .duration(950)
        .attr("y", income_percentile < 0.97 ? arrowY1 : arrowY1 + 10);

      verticalLabel
        .transition() // Add transition
        .duration(250)
        .attr("x", 150)
        .attr("y", -500);

      glowingPoint
        .transition() // Add transition
        .duration(600)
        .attr("cx", x(income_percentile))
        .attr("cy", y(income));
      // horizontalLine.attr("y1", y(60000)).attr("y2", y(60000));
      // Update the line
      line
        .select(".line")
        .datum(newData)
        .transition()
        .attr(
          "d",
          d3
            .line()
            .x((d) => x(d.income_percentile))
            .y((d) => y(d.income)),
        );

      xAxis.selectAll("text").attr("fill", "#d8f3ff");
      xAxis
        .selectAll("text")
        .style("font-size", width < 600 ? "0.6rem" : "0.7rem");

      xAxis
        .selectAll("line")
        .attr("stroke", sex === "Male" ? "#eef7ff" : "#d7ffee");
      xAxis
        .select("path")
        .attr("stroke", sex === "Male" ? "#eef7ff" : "#d7ffee");
      yAxis
        .selectAll("text")
        .attr("fill", sex === "Male" ? "#eef7ff" : "#d7ffee")
        .attr("transform", "translate(5, 0)");
      // yAxis.selectAll("line").attr("stroke", "none");
      yAxis.selectAll("line").style("opacity", "20%");
      yAxis.selectAll("line").style("color", "#EDC951");
      yAxis.select("path").attr("stroke", "none");
    });
  }, [data, margin.bottom, margin.left, margin.right, margin.top]);

  return (
    <>
      <div className="fixed top-0 z-40 flex flex-col items-start justify-start">
        <button
          onClick={() => logInputRef.current(incomePercentile_female)}
          className="w-32 text-sm"
        >
          Dataset 1
        </button>
        <button
          onClick={() => logInputRef.current(incomePercentile_male)}
          className="w-32 text-sm"
        >
          Dataset 2
        </button>
      </div>

      <svg ref={svgRef}></svg>
    </>
  );
};

export default LineChart;
