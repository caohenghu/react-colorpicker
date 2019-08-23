import './hue.scss'

export default class Hue extends React.PureComponent {
    constructor(props) {
        super(props)
        this.hue = React.createRef()
        this.canvasHue = React.createRef()
        this.renderColor = this.renderColor.bind(this)
        this.renderSlide = this.renderSlide.bind(this)
        this.selectHue = this.selectHue.bind(this)
        this.state = {
            slideHueStyle: {}
        }
    }

    render() {
        return (
            <div ref={this.hue} className="hue" onMouseDown={this.selectHue}>
                <canvas ref={this.canvasHue} />
                <div style={this.state.slideHueStyle} className="slide" />
            </div>
        )
    }

    componentDidMount() {
        this.renderColor()
        this.renderSlide()
    }

    renderColor() {
        const canvas = this.canvasHue.current
        const width = this.props.width
        const height = this.props.height
        const ctx = canvas.getContext('2d')
        canvas.width = width
        canvas.height = height

        const gradient = ctx.createLinearGradient(0, 0, 0, height)
        gradient.addColorStop(0, '#FF0000') // 红
        gradient.addColorStop(0.17 * 1, '#FF00FF') // 紫
        gradient.addColorStop(0.17 * 2, '#0000FF') // 蓝
        gradient.addColorStop(0.17 * 3, '#00FFFF') // 青
        gradient.addColorStop(0.17 * 4, '#00FF00') // 绿
        gradient.addColorStop(0.17 * 5, '#FFFF00') // 黄
        gradient.addColorStop(1, '#FF0000') // 红
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
    }

    renderSlide() {
        this.setState({
            slideHueStyle: {
                top: (1 - this.props.hsv.h / 360) * this.props.height - 2 + 'px'
            }
        })
    }

    selectHue(e) {
        const { top: hueTop } = this.hue.current.getBoundingClientRect()
        const ctx = e.target.getContext('2d')

        const mousemove = e => {
            let y = e.clientY - hueTop

            if (y < 0) {
                y = 0
            }
            if (y > this.props.height) {
                y = this.props.height
            }

            this.setState({
                slideHueStyle: {
                    top: y - 2 + 'px'
                }
            })
            // 如果用最大值，选择的像素会是空的，空的默认是黑色
            const imgData = ctx.getImageData(
                0,
                Math.min(y, this.props.height - 1),
                1,
                1
            )
            const [r, g, b] = imgData.data
            this.props.selectHue({ r, g, b })
        }

        mousemove(e)

        const mouseup = () => {
            document.removeEventListener('mousemove', mousemove)
            document.removeEventListener('mouseup', mouseup)
        }

        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
    }
}

Hue.defaultProps = {
    hsv: null,
    width: 0,
    height: 0,
    selectHue: () => {}
}

Hue.propTypes = {
    hsv: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    selectHue: PropTypes.func
}
