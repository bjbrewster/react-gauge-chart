import {
  arc,
  pie,
  select,
  easeElastic,
  interpolateHsl,
  interpolateNumber,
} from "d3";

// Helpers
const first = (array) => array[0]
const last = (array) => array[array.length - 1]

// Constants
const startAngle = -Math.PI / 2; //Negative x-axis
const endAngle = Math.PI / 2; //Positive x-axis

// Returns array of arc data (length and color) for pie and arc generator
const getArcData = ({ nrOfLevels, arcsLength, colors }) => {
  // We have to make a decision about number of arcs to display
  // If arcsLength is setted, we choose arcsLength length instead of nrOfLevels
  const nbArcsToDisplay = arcsLength ? arcsLength.length : nrOfLevels;

  //Check if the number of colors equals the number of levels
  //Otherwise make an interpolation
  const arcColors = (nbArcsToDisplay === colors.length)
    ? colors
    : interpolateColors(first(colors), last(colors), nbArcsToDisplay);
  
  //The data that is used to create the arc
  // Each arc could have hiw own value width arcsLength prop
  return arcColors.map((color, index) => ({
    value: arcsLength ? arcsLength[index] : 1,
    color,
  }))
};

//Renders the chart
export const renderChart = (
  prevProps,
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
) => {
  updateDimensions(props, container, margin, width, height);

  //Set dimensions of svg element and translations
  svg.current
    .attr("width", width.current + margin.current.left + margin.current.right)
    .attr(
      "height",
      height.current + margin.current.top + margin.current.bottom
    );
  g.current.attr(
    "transform",
    "translate(" + margin.current.left + ", " + margin.current.top + ")"
  );
  //Set the radius to lesser of width or height and remove the margins
  //Calculate the new radius
  calculateRadius(width, height, outerRadius, margin, g);
  doughnut.current.attr(
    "transform",
    "translate(" + outerRadius.current + ", " + outerRadius.current + ")"
  );
  //Setup the arc
  const arcChart = arc()
    .outerRadius(outerRadius.current)
    .innerRadius(outerRadius.current * (1 - props.arcWidth))
    .cornerRadius(props.cornerRadius)
    .padAngle(props.arcPadding);
  //Remove the old stuff
  doughnut.current.selectAll(".arc").remove();
  needle.current.selectAll("*").remove();
  g.current.selectAll(".text-group").remove();
  //Set up the pie generator
  const pieChart = pie()
    .value((d) => d.value)
    .startAngle(startAngle)
    .endAngle(endAngle)
    .sort(null);
  //Draw the arc
  var arcPaths = doughnut.current
    .selectAll(".arc")
    .data(pieChart(getArcData(props)))
    .enter()
    .append("g")
    .attr("class", "arc");
  arcPaths
    .append("path")
    .attr("d", arcChart)
    .style("fill", function (d) {
      return d.data.color;
    });

  drawNeedle(
    prevProps,
    props,
    width,
    needle,
    container,
    outerRadius,
    g
  );
  //Translate the needle starting point to the middle of the arc
  needle.current.attr(
    "transform",
    "translate(" + outerRadius.current + ", " + outerRadius.current + ")"
  );
};

const interpolateColors = (startColor, endColor, length) => {
  const interpolator = interpolateHsl(startColor, endColor)

  return length > 1 
    ? Array.from({ length }, (_, i) => interpolator(i / (length - 1)))
    : [startColor]
}

const drawNeedle = (
  prevProps,
  props,
  width,
  needle,
  container,
  outerRadius,
  g
) => {
  const { percent, needleColor, needleBaseColor, hideText, animate } = props;
  var needleRadius = 15 * (width.current / 500), // Make the needle radius responsive
    centerPoint = [0, -needleRadius / 2];
  //Draw the triangle
  //var pathStr = `M ${leftPoint[0]} ${leftPoint[1]} L ${topPoint[0]} ${topPoint[1]} L ${rightPoint[0]} ${rightPoint[1]}`;
  const prevPercent = prevProps ? prevProps.percent : 0;
  var pathStr = calculateRotation(prevPercent || percent, outerRadius, width);
  needle.current.append("path").attr("d", pathStr).attr("fill", needleColor);
  //Add a circle at the bottom of needle
  needle.current
    .append("circle")
    .attr("cx", centerPoint[0])
    .attr("cy", centerPoint[1])
    .attr("r", needleRadius)
    .attr("fill", needleBaseColor);
  if (!hideText) {
    addText(percent, props, outerRadius, width, g);
  }
  //Rotate the needle
  if (animate) {
    needle.current
      .transition()
      .delay(props.animDelay)
      .ease(easeElastic)
      .duration(props.animateDuration)
      .tween("progress", function () {
        const currentPercent = interpolateNumber(prevPercent, percent);
        return function (percentOfPercent) {
          const progress = currentPercent(percentOfPercent);
          return container.current
            .select(`.needle path`)
            .attr("d", calculateRotation(progress, outerRadius, width));
        };
      });
  } else {
    container.current
      .select(`.needle path`)
      .attr("d", calculateRotation(percent, outerRadius, width));
  }
};

const calculateRotation = (percent, outerRadius, width) => {
  var needleLength = outerRadius.current * 0.55, //TODO: Maybe it should be specified as a percentage of the arc radius?
    needleRadius = 15 * (width.current / 500),
    theta = percentToRad(percent),
    centerPoint = [0, -needleRadius / 2],
    topPoint = [
      centerPoint[0] - needleLength * Math.cos(theta),
      centerPoint[1] - needleLength * Math.sin(theta),
    ],
    leftPoint = [
      centerPoint[0] - needleRadius * Math.cos(theta - Math.PI / 2),
      centerPoint[1] - needleRadius * Math.sin(theta - Math.PI / 2),
    ],
    rightPoint = [
      centerPoint[0] - needleRadius * Math.cos(theta + Math.PI / 2),
      centerPoint[1] - needleRadius * Math.sin(theta + Math.PI / 2),
    ];
  var pathStr = `M ${leftPoint[0]} ${leftPoint[1]} L ${topPoint[0]} ${topPoint[1]} L ${rightPoint[0]} ${rightPoint[1]}`;
  return pathStr;
};

//Returns the angle (in rad) for the given 'percent' value where percent = 1 means 100% and is 180 degree angle
const percentToRad = (percent) => {
  return percent * Math.PI;
};

//Adds text undeneath the graft to display which percentage is the current one
const addText = (percentage, props, outerRadius, width, g) => {
  const { formatTextValue, fontSize } = props;
  var textPadding = 20;
  const text = formatTextValue
    ? formatTextValue(floatingNumber(percentage))
    : floatingNumber(percentage) + "%";
  g.current
    .append("g")
    .attr("class", "text-group")
    .attr(
      "transform",
      `translate(${outerRadius.current}, ${
        outerRadius.current / 2 + textPadding
      })`
    )
    .append("text")
    .text(text)
    // this computation avoid text overflow. When formatted value is over 10 characters, we should reduce font size
    .style("font-size", () =>
      fontSize
        ? fontSize
        : `${width.current / 11 / (text.length > 10 ? text.length / 10 : 1)}px`
    )
    .style("fill", props.textColor)
    .style("text-anchor", "middle");
};

const floatingNumber = (value, maxDigits = 2) => {
  return Math.round(value * 100 * 10 ** maxDigits) / 10 ** maxDigits;
};

const calculateRadius = (width, height, outerRadius, margin, g) => {
  //The radius needs to be constrained by the containing div
  //Since it is a half circle we are dealing with the height of the div
  //Only needs to be half of the width, because the width needs to be 2 * radius
  //For the whole arc to fit

  //First check if it is the width or the height that is the "limiting" dimension
  if (width.current < 2 * height.current) {
    //Then the width limits the size of the chart
    //Set the radius to the width - the horizontal margins
    outerRadius.current =
      (width.current - margin.current.left - margin.current.right) / 2;
  } else {
    outerRadius.current =
      height.current - margin.current.top - margin.current.bottom;
  }
  centerGraph(width, g, outerRadius, margin);
};

//Calculates new margins to make the graph centered
const centerGraph = (width, g, outerRadius, margin) => {
  margin.current.left =
    width.current / 2 - outerRadius.current + margin.current.right;
  g.current.attr(
    "transform",
    "translate(" + margin.current.left + ", " + margin.current.top + ")"
  );
};

const updateDimensions = (props, container, margin, width, height) => {
  //TODO: Fix so that the container is included in the component
  const { marginInPercent } = props;
  var divDimensions = process.env.NODE_ENV === 'test' 
    ? { width: 500, height: 250 }
    : container.current.node().getBoundingClientRect();
  var divWidth = divDimensions.width;
  var divHeight = divDimensions.height;

  //Set the new width and horizontal margins
  margin.current.left = divWidth * marginInPercent;
  margin.current.right = divWidth * marginInPercent;
  width.current = divWidth - margin.current.left - margin.current.right;

  margin.current.top = divHeight * marginInPercent;
  margin.current.bottom = divHeight * marginInPercent;
  height.current =
    width.current / 2 - margin.current.top - margin.current.bottom;
  //height.current = divHeight - margin.current.top - margin.current.bottom;
};
