import { createLinearGradient } from './mixin'
import './saturation.scss'

export default class Saturation extends React.PureComponent {
    constructor(props) {
        super(props)
        this.saturation = React.createRef()
        this.canvasSaturation = React.createRef()
        this.renderColor = this.renderColor.bind(this)
        this.renderSlide = this.renderSlide.bind(this)
        this.selectSaturation = this.selectSaturation.bind(this)
        this.renderColor = this.renderColor.bind(this)
        this.state = {
            slideSaturationStyle: {}
        }
    }

    render() {
        return (
            <div
                ref={this.saturation}
                className="saturation"
                onMouseDown={this.selectSaturation}
            >
                <canvas ref={this.canvasSaturation} />
                <div
                    style={this.state.slideSaturationStyle}
                    className="slide"
                />
            </div>
        )
    }

    componentDidMount() {
        this.renderColor()
        this.renderSlide()
    }

    renderColor() {
        const canvas = this.canvasSaturation.current
        const size = this.props.size
        const ctx = canvas.getContext('2d')
        canvas.width = size
        canvas.height = size

        ctx.fillStyle = this.props.color
        ctx.fillRect(0, 0, size, size)

        createLinearGradient(
            'l',
            ctx,
            size,
            size,
            '#FFFFFF',
            'rgba(255,255,255,0)'
        )
        createLinearGradient('p', ctx, size, size, 'rgba(0,0,0,0)', '#000000')
    }
    renderSlide() {
        this.setState({
            slideSaturationStyle: {
                left: this.props.hsv.s * this.props.size - 5 + 'px',
                top: (1 - this.props.hsv.v) * this.props.size - 5 + 'px'
            }
        })
    }
    selectSaturation(e) {
        const {
            top: saturationTop,
            left: saturationLeft
        } = this.saturation.current.getBoundingClientRect()
        const ctx = e.target.getContext('2d')

        const mousemove = e => {
            let x = e.clientX - saturationLeft
            let y = e.clientY - saturationTop

            if (x < 0) {
                x = 0
            }
            if (y < 0) {
                y = 0
            }
            if (x > this.props.size) {
                x = this.props.size
            }
            if (y > this.props.size) {
                y = this.props.size
            }

            // 不通过监听数据变化来修改dom，否则当颜色为#ffffff时，slide会跑到左下角
            this.setState({
                slideSaturationStyle: {
                    left: x - 5 + 'px',
                    top: y - 5 + 'px'
                }
            })
            // 如果用最大值，选择的像素会是空的，空的默认是黑色
            const imgData = ctx.getImageData(
                Math.min(x, this.props.size - 1),
                Math.min(y, this.props.size - 1),
                1,
                1
            )
            const [r, g, b] = imgData.data
            this.props.selectSaturation({ r, g, b })
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

Saturation.defaultProps = {
    color: '',
    hsv: {},
    size: 0,
    selectSaturation: () => {}
}

Saturation.propTypes = {
    color: PropTypes.string,
    hsv: PropTypes.object,
    size: PropTypes.number,
    selectSaturation: PropTypes.func
}
