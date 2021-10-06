import { defaults, first, last, range } from 'lodash-es'
import { arc, pie, select, easeElastic, interpolateHsl, PieArcDatum, Selection } from 'd3'
import { CreateGaugeProps } from './types'

type SVGElementSelection = Selection<SVGElement, unknown, null, undefined>

const WIDTH = 200
const HEIGHT = WIDTH / 2 * 1.06
const OUTER_RADIUS = WIDTH / 2
const NEEDLE_RADIUS = WIDTH * 0.03
const NEEDLE_LENGTH = OUTER_RADIUS * 0.65
const ANIM_DURATION = 3000
const ANIM_DELAY = 500

const DEFAULT_PROPS: CreateGaugeProps = {
  arcSegments: 3,
  arcSegmentLengths: undefined,
  arcPadding: 0.05,
  arcRadius: 6,
  arcWidth: 0.2,
  arcColors: ['#00FF00', '#FF0000'],
  needleColor: '#464A4F',
  needleBaseColor: '#464A4F',
  hideText: false,
  textColor: '#fff',
  fontSize: `20px`,
}

const interpolateColors = (startColor: string, endColor: string, count: number): string[] => {
  const interpolator = interpolateHsl(startColor, endColor)

  return count <= 1 ? [startColor] : range(count).map((i) => interpolator(i / (count - 1)))
}

interface ArcSegmentData {
  value: number
  color: string
}

const getArcSegmentData = (props: CreateGaugeProps): ArcSegmentData[] => {
  const { arcSegments, arcColors, arcSegmentLengths } = props
  const numSegments = (arcSegmentLengths ? arcSegmentLengths.length : arcSegments) || 1
  const colors = (numSegments === arcColors.length) ? arcColors : interpolateColors(first(arcColors), last(arcColors), numSegments)

  return colors.map((color: string, index: number) => ({
    value: arcSegmentLengths ? arcSegmentLengths[index] : 1,
    color: color,
  }))
}

const createArc = (svg: SVGElementSelection, props: CreateGaugeProps) => {
  const { arcWidth, arcRadius, arcPadding } = props
  const arcData = getArcSegmentData(props)

  const pieChart = pie<ArcSegmentData>()
    .value((d) => d.value)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2)
    .sort(null)

  const arcChart = arc<PieArcDatum<ArcSegmentData>>()
    .outerRadius(OUTER_RADIUS)
    .innerRadius(OUTER_RADIUS * (1 - arcWidth))
    .cornerRadius(arcRadius)
    .padAngle(arcPadding)

  const doughnut = svg.append('g')
    .attr('class', 'doughnut')

  doughnut.selectAll('.arc')
    .data(pieChart(arcData))
    .enter()
      .append('g')
        .attr('class', 'arc')
        .append('path')
          .attr('d', (d) => arcChart(d))
          .style('fill', (d) => d.data.color)
}

const createNeedle = (svg: SVGElementSelection, props: CreateGaugeProps) => {
  const { needleColor, needleBaseColor } = props

  const needle = svg.append('g')
    .attr('class', 'needle')

  needle.append('path')
    .attr('d', `M 0 ${NEEDLE_RADIUS} L ${-NEEDLE_LENGTH} 0 L 0 ${-NEEDLE_RADIUS}`)
    .attr('fill', needleColor)

  needle.append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', NEEDLE_RADIUS)
    .attr('fill', needleBaseColor)
}

const createText = (svg: SVGElementSelection, props: CreateGaugeProps) => {
  const { hideText, textColor, fontSize } = props

  if (hideText) return

  svg.append('text')
    .attr('x', 0)
    .attr('y', -OUTER_RADIUS * 0.3)
    .style('font-size', fontSize)
    .style('fill', textColor)
    .style('text-anchor', 'middle')
}

export const createGauge = (svgContainer: SVGSVGElement, optProps: Partial<CreateGaugeProps>) => {
  const props = defaults({}, optProps, DEFAULT_PROPS)

  const svg = select(svgContainer).append('svg')
    .style('display', 'block')
    .attr('width', '100%')
    .attr('viewBox', `${-WIDTH / 2} ${-OUTER_RADIUS} ${WIDTH} ${HEIGHT}`)

  createArc(svg, props)
  createNeedle(svg, props)
  createText(svg, props)

  return svg
}

export const updateGauge = (svgContainer: SVGSVGElement, value: number = 0, text?: string, animate: boolean = false) => {
  const svg = select(svgContainer)
  const needle = svg.select(`.needle`)

  svg.select('text').text(text ?? `${(value * 100).toFixed(1)}%`)

  const needleRotation = `rotate(${value * 180})`

  if (animate) {
    needle.transition()
      .attr('transform', needleRotation)
      .ease(easeElastic)
      .delay(ANIM_DELAY)
      .duration(ANIM_DURATION)
  } else {
    needle.attr('transform', needleRotation)
  }
}
