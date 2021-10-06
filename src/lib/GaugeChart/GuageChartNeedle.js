
function GuageChartNeedle(props) {
  const { needleColor, needleBaseColor, percent, animate, animDelay, animDuration } = props
  const needleRef = useRef(null)

  // TODO disable animation first time?
  useLayoutEffect(() => {
    const needle = select(needleRef.current)
    const transform = `rotate(${percent * 180})`

    if (animate) {
      needle.transition()
        .attr('transform', transform)
        .ease(easeElastic)
        .delay(animDelay)
        .duration(animDuration)
    } else {
      needle.attr('transform', transform)
    }
  }, [percent])

  return (
    <g className="needle" ref={needleRef}>
      <path fill={needleColor} d={`M 0 ${NEEDLE_RADIUS} L ${-NEEDLE_LENGTH} 0 L 0 ${-NEEDLE_RADIUS}`} />
      <circle fill={needleBaseColor} cx={0} cy={0} r={NEEDLE_RADIUS} />
    </g>
  )
}

GuageChartNeedle.propTypes = {
  percent: PropTypes.number,
  needleColor: PropTypes.string,
  needleBaseColor: PropTypes.string,
  animate: PropTypes.bool,
  animDelay: PropTypes.number,
  animDuration: PropTypes.number,
}

GuageChartNeedle.defaultProps = {
  needleColor: '#464A4F',
  needleBaseColor: '#464A4F',
  animate: true,
  animDelay: 500,
  animDuration: 3000,
}

GuageChartNeedle.updateProps = ['percent', 'needleColor', 'needleBaseColor']
