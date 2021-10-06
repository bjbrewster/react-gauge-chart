function GuageChartText(props) {
  const { percent, text = `${(percent * 100).toFixed(1)}%`, textColor: fill, fontSize } = props

  return text && (
    <text x={0} y={-OUTER_RADIUS * 0.3} style={{ fill, fontSize, textAnchor: 'middle' }}>
      {text}
    </text>
  )
}

GuageChartText.propsTypes = {
  text: PropTypes.element,
  percent: PropTypes.number,
  textColor: PropTypes.string,
  fontSize: PropTypes.number,
}

GuageChartText.defaultProps = {
  textColor: '#fff',
  fontSize: `20px`,
}

GuageChartText.updateProps = Object.keys(GuageChartText.propsTypes)
