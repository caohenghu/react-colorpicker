import './alpha.scss'
import { createAlphaSquare, createLinearGradient } from './mixin'

export default class Alpha extends React.PureComponent {
    constructor(props) {
        super(props)
        this.alpha = React.createRef()
        this.canvasAlpha = React.createRef()
        this.renderColor = this.renderColor.bind(this)
        this.renderSlide = this.renderSlide.bind(this)
        this.selectAlpha = this.selectAlpha.bind(this)
        this.state = {
            slideAlphaStyle: {}
        }
    }

    render() {
        return (
            <div
                ref={this.alpha}
                className="color-alpha"
                onMouseDown={this.selectAlpha}
            >
                <canvas ref={this.canvasAlpha} />
                <div style={this.state.slideAlphaStyle} className="slide" />
            </div>
        )
    }

    componentDidMount() {
        this.renderColor()
        this.renderSlide()
    }

    renderColor() {
        const canvas = this.canvasAlpha.current
        const width = this.props.width
        const height = this.props.height
        const { r, g, b } = this.props.rgba
        const color = `rgb(${r}, ${g}, ${b})`
        const canvasSquare = createAlphaSquare(5)

        const ctx = canvas.getContext('2d')
        canvas.width = width
        canvas.height = height

        ctx.fillStyle = ctx.createPattern(canvasSquare, 'repeat')
        ctx.fillRect(0, 0, width, height)

        createLinearGradient(
            'p',
            ctx,
            width,
            height,
            'rgba(255,255,255,0)',
            color
        )
    }

    renderSlide() {
        this.setState({
            slideAlphaStyle: {
                top: this.props.rgba.a * this.props.height - 2 + 'px'
            }
        })
    }

    selectAlpha(e) {
        const { top: hueTop } = this.alpha.current.getBoundingClientRect()

        const mousemove = e => {
            let y = e.clientY - hueTop

            if (y < 0) {
                y = 0
            }
            if (y > this.props.height) {
                y = this.props.height
            }

            this.setState({
                slideAlphaStyle: {
                    top: y - 2 + 'px'
                }
            })
            let a = parseFloat((y / this.props.height).toFixed(2))
            this.props.selectAlpha(a)
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

Alpha.defaultProps = {
    rgba: null,
    width: 0,
    height: 0,
    selectAlpha: () => {}
}

Alpha.propTypes = {
    rgba: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    selectAlpha: PropTypes.func
}
