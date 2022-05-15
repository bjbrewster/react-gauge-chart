import React, { useCallback, useRef, useLayoutEffect } from "react";
import { select } from "d3";
import PropTypes from "prop-types";

import { useDeepCompareEffect } from "./hooks";
import { setArcData, renderChart } from './utils'

/*
GaugeChart creates a gauge chart using D3
The chart is responsive and will have the same width as the "container"
The radius of the gauge depends on the width and height of the container
It will use whichever is smallest of width or height
The svg element surrounding the gauge will always be square
"container" is the div where the chart should be placed
*/

//Constants

const defaultStyle = {
  width: "100%",
};

const GaugeChart = (props) => {
  const svg = useRef({});
  const g = useRef({});
  const width = useRef({});
  const height = useRef({});
  const doughnut = useRef({});
  const needle = useRef({});
  const outerRadius = useRef({});
  const margin = useRef({}); // = {top: 20, right: 50, bottom: 50, left: 50},
  const container = useRef({});
  const nbArcsToDisplay = useRef(0);
  const colorArray = useRef([]);
  const arcData = useRef([]);
  const prevProps = useRef();
  const selectedRef = useRef();

  const initChart = useCallback(() => {
    container.current = select(selectedRef.current);
    container.current.select("svg").remove();
    svg.current = container.current.append("svg");
    g.current = svg.current.append("g"); //Used for margins
    doughnut.current = g.current.append("g").attr("class", "doughnut");
    needle.current = g.current.append("g").attr("class", "needle");
  }, [])

  useLayoutEffect(() => {
    initChart();
  }, [initChart]);

  useDeepCompareEffect(() => {
    if (
      !prevProps.current ||
      props.nrOfLevels ||
      prevProps.current.arcsLength.every((a) => props.arcsLength.includes(a)) ||
      prevProps.current.colors.every((a) => props.colors.includes(a))
    ) {
      setArcData(props, nbArcsToDisplay, colorArray, arcData);
    }

    renderChart(
      prevProps.current,
      width,
      margin,
      height,
      outerRadius,
      g,
      doughnut,
      needle,
      svg,
      props,
      container,
      arcData
    );

    prevProps.current = props;
  }, [
    props.nrOfLevels,
    props.arcsLength,
    props.colors,
    props.percent,
    props.needleColor,
    props.needleBaseColor,
  ]);

  const { id, style, className } = props;
  return (
    <div
      id={id}
      className={className}
      style={style}
      ref={selectedRef}
    />
  );
};

GaugeChart.defaultProps = {
  style: defaultStyle,
  marginInPercent: 0.05,
  cornerRadius: 6,
  nrOfLevels: 3,
  percent: 0.4,
  arcPadding: 0.05, //The padding between arcs, in rad
  arcWidth: 0.2, //The width of the arc given in percent of the radius
  colors: ["#00FF00", "#FF0000"], //Default defined colors
  textColor: "#fff",
  needleColor: "#464A4F",
  needleBaseColor: "#464A4F",
  hideText: false,
  animate: true,
  animDelay: 500,
  formatTextValue: null,
  fontSize: null,
  animateDuration: 3000,
};

GaugeChart.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  marginInPercent: PropTypes.number,
  cornerRadius: PropTypes.number,
  nrOfLevels: PropTypes.number,
  percent: PropTypes.number,
  arcPadding: PropTypes.number,
  arcWidth: PropTypes.number,
  arcsLength: PropTypes.array,
  colors: PropTypes.array,
  textColor: PropTypes.string,
  needleColor: PropTypes.string,
  needleBaseColor: PropTypes.string,
  hideText: PropTypes.bool,
  animate: PropTypes.bool,
  formatTextValue: PropTypes.func,
  fontSize: PropTypes.string,
  animateDuration: PropTypes.number,
  animDelay: PropTypes.number,
};

export default GaugeChart;
