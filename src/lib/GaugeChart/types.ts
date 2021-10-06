export interface CreateGaugeProps {
  /**
   * The number of segments displayed in the arc
   * @default 3
   */
  arcSegments: number

  /**
   * An array specifying the length of each arc segment. If this prop is set, the arcSegments prop will have no effect
   */
  arcSegmentLengths: number[] | undefined

  /**
   * An array of colors in HEX format displayed in the arc. Must be same length as arcSegments/arcSegmentLengths or first and last color will be interpolated.
   * @default ["#00FF00", "#FF0000"]
   */
  arcColors: string[]

  /**
   * The distance between the segments in the arc
   * @default 0.05
   */
  arcPadding: number

  /**
   * Corner radius for the segments in the chart
   * @default 6
   */
  arcRadius: number

  /**
    * The thickness of the arc given in percent of the radius
    * @default 0.2
    */
  arcWidth: number

  /**
   * The color of the needle triangle
   * @default "#464A4F"
   */
  needleColor: string

  /**
   * The color of the circle at the base of the needle
   * @default "#464A4F"
   */
  needleBaseColor: string

  /**
   * Whether or not to hide the percentage display
   * @default false
   */
  hideText: boolean

  /**
   * The color of the text
   * @default "#FFFFFF"
   */
  textColor: string

  /**
   * The font size of gauge text
   * @default null
   */
  fontSize: string
}

export interface GaugeChartProps extends CreateGaugeProps {
  /**
   * Optional id for container element
   */
  id: string

  /**
   * Optional class name(s) for container element
   */
  className: string

  /**
   * Optional CSS styles to apply to container
   */
  style: React.CSSProperties

  /**
   * The number where the needle should point to (between 0 and 1)
   * @default 0
   */
  value: number

  /**
   * The displayed text value
   * @default `${(value * 100).toFixed(1)}%`
   */
  text: string

  /**
   * Should the needle animate on changed value
   * @default true
   */
  animate: boolean
}
