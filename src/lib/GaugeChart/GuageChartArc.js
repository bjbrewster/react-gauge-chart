
const START_ANGLE = -Math.PI / 2
const END_ANGLE = Math.PI / 2


const interpolateColors = (startColor, endColor, count) => {
  const interpolator = interpolateHsl(startColor, endColor)

  return count <= 1 ? [startColor] : range(count).map((i) => interpolator(i / (count - 1)))
}

const getArcSegmentData = (arcSegments, arcColors, arcSegmentLengths) => {
  const numSegments = (arcSegmentLengths ? arcSegmentLengths.length : arcSegments) || 1
  const colors = (numSegments === arcColors.length) ? arcColors : interpolateColors(first(arcColors), last(arcColors), numSegments)

  return colors.map((color, index) => ({
    value: arcSegmentLengths ? arcSegmentLengths[index] : 1,
    color: color,
  }))
}

function GuageChartArc(props) {
  const { arcSegments, arcColors, arcSegmentLengths, arcWidth, arcRadius, arcPadding } = props
  const arcData = getArcSegmentData(arcSegments, arcColors, arcSegmentLengths)

  const pieChart = pie()
    .value((d) => d.value)
    .startAngle(START_ANGLE)
    .endAngle(END_ANGLE)
    .sort(null)

  const arcChart = arc()
    .outerRadius(OUTER_RADIUS)
    .innerRadius(OUTER_RADIUS * (1 - arcWidth))
    .cornerRadius(arcRadius)
    .padAngle(arcPadding)

  return (
    <g className="doughnut">
      {pieChart(arcData).map(({ d, index }) => {
        console.log({ d, index })
        return (
        <g className="arc">
          <path fill={d.data.color} d={arcChart(d)} />
        </g>
      )})}
    </g>
  )
}

GuageChartArc.propTypes = {
  arcSegments: PropTypes.number,
  arcSegmentLengths: PropTypes.arrayOf(PropTypes.number),
  arcColors: PropTypes.arrayOf(PropTypes.string),
  arcPadding: PropTypes.number,
  arcRadius: PropTypes.number,
  arcWidth: PropTypes.number,
}

GuageChartArc.defaultProps = {
  arcSegments: 3,
  arcColors: ['#00FF00', '#FF0000'],
  arcPadding: 0.05,
  arcRadius: 6,
  arcWidth: 0.2,
}

GuageChartArc.updateProps = Object.keys(GuageChartArc.propTypes)
