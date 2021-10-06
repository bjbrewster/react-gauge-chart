import PropTypes from 'prop-types'
import { first, last, range } from 'lodash-es'
import React, { useRef, useMemo, useLayoutEffect } from 'react'
import { arc, pie, select, easeElastic, interpolateHsl } from 'd3'

const WIDTH = 200
const HEIGHT = WIDTH / 2 * 1.06
const OUTER_RADIUS = WIDTH / 2
const NEEDLE_RADIUS = WIDTH * 0.03
const NEEDLE_LENGTH = OUTER_RADIUS * 0.65

const getUpdateDeps = (props, component) => component.updateProps.map((key) => props[key])

/*
GaugeChart creates an SVG gauge chart using D3. The SVG element will auto fit inside the container.
*/
function GaugeChart(props) {
  const { id, className, style } = props

  const arcNode = useMemo(() => <GuageChartArc {...props} />, getUpdateDeps(props, GuageChartArc))
  const needleNode = useMemo(() => <GuageChartNeedle {...props} />, getUpdateDeps(props, GuageChartNeedle))
  const textNode = useMemo(() => <GuageChartText {...props} />, getUpdateDeps(props, GuageChartText))

  return (
    <div id={id} className={className} style={style}>
      <svg style={{ display: 'block' }} viewBox={`${-WIDTH / 2} ${-OUTER_RADIUS} ${WIDTH} ${HEIGHT}`}>
        {arcNode}
        {needleNode}
        {textNode}
      </svg>
    </div>
  )
}

GaugeChart.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  ...GuageChartArc.propTypes,
  ...GuageChartNeedle.propTypes,
  ...GuageChartText.propTypes,
}

GuageChart.defaultProps = {
  percent: 0.4,
}

export default GaugeChart
