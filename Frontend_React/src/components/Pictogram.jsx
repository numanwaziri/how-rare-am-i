import { useEffect, useRef, useState } from "react";
import { select, range } from "d3";
export const Pictogram = ({
  totalPoints = 100,
  activePointsRatio = 0.3,
  color = "#4D908E",
  activeColor = "#adf7b6",
  borderColor = "Black",
  sex,
  data,
}) => {
  const gridChartRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Function to update the size state
  const updateSize = () => {
    if (gridChartRef.current) {
      setSize({
        width: gridChartRef.current.clientWidth,
        height: gridChartRef.current.clientHeight,
      });
    }
  };

  // Debounce function
  const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const debouncedUpdateSize = debounce(updateSize, 500); // 250 milliseconds

  useEffect(() => {
    // Initial size update
    updateSize();

    // Update size on window resize
    window.addEventListener("resize", debouncedUpdateSize);

    // Cleanup
    return () => window.removeEventListener("resize", debouncedUpdateSize);
  }, []);

  useEffect(() => {
    if (!size.width || !size.height) return;

    const containerWidth = gridChartRef.current.clientWidth;
    const containerHeight = gridChartRef.current.clientHeight;

    const padding = 20;
    const drawingWidth = containerWidth - 2 * padding;
    const drawingHeight = containerHeight - 2 * padding;

    var numCols = Math.ceil(
      Math.sqrt(totalPoints * (drawingWidth / drawingHeight)),
    );
    var numRows = Math.ceil(totalPoints / numCols);

    const radius = Math.min(
      drawingWidth / (numCols * 2),
      drawingHeight / (numRows * 1.5),
    );

    numCols = Math.ceil(drawingWidth / (radius * 2));
    numRows = Math.ceil(drawingHeight / (radius * 1.5));

    select("#grid-chart svg").remove();

    var svg = select("#grid-chart")
      .append("svg")
      .attr("width", containerWidth)
      .attr("height", containerHeight);

    // Define a shadow filter
    var defs = svg.append("defs");
    var filter = defs
      .append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "130%"); // To accommodate the shadow

    filter
      .append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 0.2) // Adjust for desired shadow strength
      .attr("result", "blur");

    filter
      .append("feOffset")
      .attr("in", "blur")
      .attr("dx", 2) // Horizontal offset
      .attr("dy", 2) // Vertical offset
      .attr("result", "offsetBlur");

    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "offsetBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    const numPoints = numCols * numRows;
    let activePointsCount = Math.floor(numPoints * activePointsRatio);

    const data = range(numPoints);

    let activeIndices = new Set();

    while (activeIndices.size < activePointsCount) {
      const randomIndex = Math.floor(Math.random() * numPoints);
      activeIndices.add(randomIndex);
    }

    const horizontalOffset =
      padding + (drawingWidth - (numCols * radius * 2 - radius)) / 2;
    const patternHeight = numRows * radius * 1.4 - radius / 2;
    const verticalOffset = padding + (drawingHeight - patternHeight) / 2;

    var container = svg
      .append("g")
      .attr("transform", `translate(${horizontalOffset}, ${verticalOffset})`);

    container
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr(
        "cx",
        (d) =>
          (d % numCols) * radius * 2 + (Math.floor(d / numCols) % 2) * radius,
      )
      .attr("cy", (d) => Math.floor(d / numCols) * radius * 1.5)
      .attr("r", radius)
      .attr("fill", color)
      .style("stroke", borderColor)
      .style("filter", "url(#drop-shadow)");

    // Transition active circles to active color after 1 second

    setTimeout(() => {
      container
        .selectAll("circle")
        .filter((d) => activeIndices.has(d))
        .each(function (d, i) {
          const circle = select(this);
          setTimeout(() => {
            circle.transition().duration(500).attr("fill", activeColor);
          }, i * 10); // Adjust delay time as needed
        });
    }, 2300);
  }, [size.width, sex, data]);

  return (
    <div id="grid-container" className=" h-full w-full   ">
      <div id="grid-chart" ref={gridChartRef} className="h-full w-full "></div>
    </div>
  );
};
