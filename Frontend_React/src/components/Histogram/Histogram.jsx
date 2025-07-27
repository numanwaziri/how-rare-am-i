import { useEffect, useMemo, useRef } from "react";

import { Rectangle } from "./Rectangle";
import { income_bins_male_5k, income_bins_female_5k } from "../Data.js";
import { scaleLinear, scaleSqrt } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { format } from "d3-format";
import { select } from "d3-selection";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
const MARGIN = { top: 40, right: 24, bottom: 22, left: 34 };

const BUCKET_PADDING = 1.5;

export const Histogram = ({
  width,
  height,
  data,
  income,
  isMax,
  sex,
  scaleType,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const domain = [0, 500000];
  const xScale = useMemo(() => {
    return scaleLinear().domain(domain).range([10, boundsWidth]);
  }, [data, width, isSmallScreen]);

  const yScale = useMemo(() => {
    return scaleType === "sqrt"
      ? scaleSqrt()
          .range([boundsHeight, 0])
          .domain([0, isSmallScreen ? 52000000 : 35000000])
          .nice()
      : scaleLinear()
          .range([boundsHeight, 0])
          .domain([0, isSmallScreen ? 52000000 : 35000000])
          .nice();
  }, [data, height, scaleType, isSmallScreen]);
  // Render the X axis using d3.js, not react
  useEffect(() => {
    const svgElement = select(axesRef.current);
    svgElement.selectAll("*").remove();

    const xAxisGenerator = axisBottom(xScale).tickFormat(format(".2s"));
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .style("color", "#eef7ff")
      .call(xAxisGenerator);

    const yAxisGenerator = axisLeft(yScale).tickFormat(format(".2s"));
    svgElement.append("g").style("color", "#eef7ff").call(yAxisGenerator);

    // this is the population with income over 500k which is not in the bins (calculated during preprocessing step)
    const over500kIncomeMale = 1059096.07;
    const over500kIncomeFemale = 397306.76;
    const highlightedPopulationMinIncome = (
      sex === "Males" ? income_bins_male_5k : income_bins_female_5k
    ).reduce(
      (sum, entry) => {
        if (entry.right > income) {
          return sum + entry.population;
        }
        return sum;
      },
      sex === "Males" ? over500kIncomeMale : over500kIncomeFemale,
    );

    const highlightedPopulationMaxnIncome = (
      sex === "Males" ? income_bins_male_5k : income_bins_female_5k
    ).reduce((sum, entry) => {
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
      .attr("x", income > 150000 ? xScale(income) - 20 : xScale(income) + 10)
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
      .attr("x", income > 150000 ? xScale(income) - 20 : xScale(income) + 10)
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
      .style("font-style", "italic")
      .style("text-anchor", "start")
      .style("fill", "#eef7ff")
      .text(` Population`)
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
  }, [xScale, yScale, boundsHeight, isSmallScreen]);

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
