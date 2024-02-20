import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { Rectangle } from "./Rectangle";

const MARGIN = { top: 40, right: 24, bottom: 22, left: 34 };

const BUCKET_PADDING = 2;

export const Histogram = ({ width, height, data, income, isMax, sex }) => {
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const domain = [0, 500000];
  const xScale = useMemo(() => {
    return d3.scaleLinear().domain(domain).range([10, boundsWidth]);
  }, [data, width]);

  const yScale = useMemo(() => {
    return d3.scaleSqrt().range([boundsHeight, 0]).domain([0, 70000000]).nice();
  }, [data, height]);

  // Render the X axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();

    const xAxisGenerator = d3.axisBottom(xScale).tickFormat(d3.format(".2s"));
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .style("color", "#eef7ff")
      .call(xAxisGenerator);

    const yAxisGenerator = d3.axisLeft(yScale).tickFormat(d3.format(".2s"));
    svgElement.append("g").style("color", "#eef7ff").call(yAxisGenerator);

    const highlightedPopulationMinIncome = data.reduce((sum, entry) => {
      if (entry.right > income) {
        return sum + entry.population;
      }
      return sum;
    }, 0);

    const highlightedPopulationMaxnIncome = data.reduce((sum, entry) => {
      if (entry.right <= income) {
        return sum + entry.population;
      }
      return sum;
    }, 0);

    function formatPopulation(population) {
      if (population >= 1000000) {
        return (population / 1000000).toFixed(2) + "M";
      } else {
        return (population / 1000).toFixed(0) + "k";
      }
    }

    svgElement
      .append("line")
      .attr("x1", xScale(income))
      .attr("x2", xScale(income))
      .attr("y1", 10)
      .attr("y2", boundsHeight)
      .attr("stroke", "#ffd54f")
      .attr("stroke-dasharray", "4");

    svgElement
      .append("text")
      .attr("x", income > 150000 ? xScale(income) - 40 : xScale(income) + 10)
      .attr("y", boundsHeight / 4.1)
      .attr(
        "transform",
        income > 150000
          ? "rotate(90," + (xScale(income) + 10) + "," + boundsHeight / 4 + ")"
          : "",
      )
      .text(
        isMax
          ? `Roughly ${formatPopulation(
              highlightedPopulationMaxnIncome,
            )} ${sex} `
          : `Roughly ${formatPopulation(
              highlightedPopulationMinIncome,
            )} ${sex} `,
      )
      .style("font-size", width < 600 ? "0.8rem" : "0.9rem")
      .style("font-weight", "500")
      .attr("fill", "#ffd54f");

    svgElement
      .append("text")
      .attr("x", income > 150000 ? xScale(income) - 40 : xScale(income) + 10)
      .attr("y", income > 150000 ? boundsHeight / 2.9 : boundsHeight / 3.25)
      .attr(
        "transform",
        income > 150000
          ? "rotate(90," + (xScale(income) + 10) + "," + boundsHeight / 4 + ")"
          : "",
      )
      .text(
        isMax
          ? `make ≤ $${income / 1000}k`
          : `make > $${income / 1000}k annually`,
      )
      .style("font-size", width < 600 ? "0.8rem" : "0.9rem")
      .style("font-weight", "500")
      .attr("fill", "#ffd54f");

    const yLabel = svgElement
      .append("text")
      .style(
        "font-size",
        width < 600 ? "0.82rem" : width < 900 ? "1rem" : "1.3rem",
      )
      .attr("y", -20)
      .attr("x", -30)
      .transition()
      .style("font-style", "italic")
      .style("text-anchor", "start")

      .style("fill", "#eef7ff")
      .text(`${sex.replace("s", "")} Population`)
      .attr("filter", "url(#glow4)");
    const xLabel = svgElement
      .append("text")
      .style(
        "font-size",
        width < 600 ? "0.82rem" : width < 900 ? "1rem" : "1.3rem",
      )
      .attr(
        "transform",
        `translate(${boundsWidth},${boundsHeight - 14}) rotate(90)`,
      )
      .style("text-anchor", "end")
      .style("font-style", "italic")
      .style("fill", "#eef7ff")
      .text("Income $")
      .attr("filter", "url(#glow4)");
  }, [xScale, yScale, boundsHeight]);

  const allRects = data.map((d, i) => {
    const { population, left, right } = d;
    if (left == undefined || right == undefined) {
      return null;
    }
    const color = !isMax
      ? right > income
        ? "#ffd54f"
        : "#b6eeff"
      : left < income
        ? "#ffd54f"
        : "#b6eeff";

    // Append a vertical line to highlight the separation

    return (
      <Rectangle
        key={i}
        color={color}
        x={xScale(left) + BUCKET_PADDING / 2}
        width={Math.abs(xScale(right) - xScale(left) - BUCKET_PADDING)}
        y={yScale(population)}
        height={Math.abs(boundsHeight - yScale(population))}
      />
    );
  });

  return (
    <svg width={width} height={Math.abs(height)}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
        {allRects}
      </g>
      <g
        width={boundsWidth}
        height={boundsHeight}
        ref={axesRef}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      />
    </svg>
  );
};
