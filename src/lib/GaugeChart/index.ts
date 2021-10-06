import React, { useRef, useMemo, useEffect, useLayoutEffect } from 'react'

import { GaugeChartProps } from './types'
import { createGauge, updateGauge } from './utils'

/*
GaugeChart creates an SVG gauge chart using D3. The SVG element will auto fit inside the container.
*/
function GaugeChart(props) {
  const { id, className, style, value, text, animate = true, ...gaugeProps } = props
  const memoGuageProps = useMemo(() => gaugeProps, [JSON.stringify(gaugeProps)])
  const svgRef = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const svg = createGauge(svgRef.current, gaugeProps)
    return () => { svg.remove() }
  }, [memoGuageProps])

  useEffect(() => {
    updateGauge(svgRef.current, value, text, animate)
  }, [memoGuageProps, value, text])

  return (
    <div id={id} className={className} style={style}>
      <svg ref={svgRef} />
    </div>
  )
}

export default GaugeChart
