import { createAlphaSquare } from './mixin'

export default class Preview extends React.Component {
    constructor(props) {
        super(props)
        this.canvasColor = React.createRef()
        this.renderColor = this.renderColor.bind(this)
        this.isRender = false
    }

    shouldComponentUpdate() {
        if (!this.isRender) {
            this.isRender = true
        }
        return !this.isRender
    }

    render() {
        return <canvas ref={this.canvasColor} />
    }

    componentDidMount() {
        this.renderColor()
    }

    componentDidUpdate() {
        this.renderColor()
    }

    renderColor() {
        const canvas = this.canvasColor.current
        const width = this.props.width
        const height = this.props.height
        const canvasSquare = createAlphaSquare(5)

        const ctx = canvas.getContext('2d')
        canvas.width = width
        canvas.height = height

        ctx.fillStyle = ctx.createPattern(canvasSquare, 'repeat')
        ctx.fillRect(0, 0, width, height)

        ctx.fillStyle = this.props.color
        ctx.fillRect(0, 0, width, height)
    }
}

Preview.defaultProps = {
    color: '',
    width: 0,
    height: 0
}

Preview.propTypes = {
    color: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number
}
