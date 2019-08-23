import './sucker.scss'
import imgSucker from '../img/sucker.png'

export default class Sucker extends React.Component {
    constructor(props) {
        super(props)
        this.openSucker = this.openSucker.bind(this)
        this.keydownHandler = this.keydownHandler.bind(this)
        this.mousemoveHandler = this.mousemoveHandler.bind(this)
        this.suckColor = this.suckColor.bind(this)
        this.state = {
            isOpenSucker: false, // 是否处于吸管状态
            suckerPreview: null, // 吸管旁边的预览颜色dom
            isSucking: false // 是否处于吸管等待状态
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state !== nextState) {
            return true
        } else if (this.props.suckerCanvas !== nextProps.suckerCanvas) {
            this.setState({ isSucking: false })
            this.suckColor(nextProps.suckerCanvas)
            nextProps.suckerCanvas.style.cursor = `url(${imgSucker}) 0 32, default`
            return true
        }
        return false
    }

    render() {
        return (
            <div>
                {!this.state.isSucking && (
                    <svg
                        className={
                            'sucker' +
                            (this.state.isOpenSucker ? ' active' : '')
                        }
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="-12 -12 48 48"
                        onClick={this.openSucker}
                    >
                        <path d="M13.1,8.2l5.6,5.6c0.4,0.4,0.5,1.1,0.1,1.5s-1.1,0.5-1.5,0.1c0,0-0.1,0-0.1-0.1l-1.4-1.4l-7.7,7.7C7.9,21.9,7.6,22,7.3,22H3.1C2.5,22,2,21.5,2,20.9l0,0v-4.2c0-0.3,0.1-0.6,0.3-0.8l5.8-5.8C8.5,9.7,9.2,9.6,9.7,10s0.5,1.1,0.1,1.5c0,0,0,0.1-0.1,0.1l-5.5,5.5v2.7h2.7l7.4-7.4L8.7,6.8c-0.5-0.4-0.5-1-0.1-1.5s1.1-0.5,1.5-0.1c0,0,0.1,0,0.1,0.1l1.4,1.4l3.5-3.5c1.6-1.6,4.1-1.6,5.8-0.1c1.6,1.6,1.6,4.1,0.1,5.8L20.9,9l-3.6,3.6c-0.4,0.4-1.1,0.5-1.5,0.1" />
                    </svg>
                )}
                {this.state.isSucking && (
                    <svg
                        className="sucker"
                        viewBox="-16 -16 68 68"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#9099a4"
                    >
                        <g fill="none" fillRule="evenodd">
                            <g transform="translate(1 1)" strokeWidth="4">
                                <circle
                                    strokeOpacity=".5"
                                    cx="18"
                                    cy="18"
                                    r="18"
                                />
                                <path d="M36 18c0-9.94-8.06-18-18-18">
                                    <animateTransform
                                        attributeName="transform"
                                        type="rotate"
                                        from="0 18 18"
                                        to="360 18 18"
                                        dur="1s"
                                        repeatCount="indefinite"
                                    />
                                </path>
                            </g>
                        </g>
                    </svg>
                )}
            </div>
        )
    }

    openSucker() {
        if (!this.state.isOpenSucker) {
            this.setState({
                isOpenSucker: true,
                isSucking: true
            })
            this.props.openSucker(true)
            document.addEventListener('keydown', this.keydownHandler)
        } else {
            // 和按下esc键的处理逻辑一样
            this.keydownHandler({ keyCode: 27 })
        }
    }

    keydownHandler(e) {
        // esc
        if (e.keyCode === 27) {
            this.setState({
                isOpenSucker: false,
                isSucking: false
            })
            this.props.openSucker(false)
            document.removeEventListener('keydown', this.keydownHandler)
            document.removeEventListener('mousemove', this.mousemoveHandler)
            document.removeEventListener('mouseup', this.mousemoveHandler)
            if (this.state.suckerPreview) {
                document.body.removeChild(this.state.suckerPreview)
                this.setState({ suckerPreview: null })
            }
        }
    }

    mousemoveHandler(e) {
        const { clientX, clientY } = e
        const {
            top: domTop,
            left: domLeft,
            width,
            height
        } = this.props.suckerCanvas.getBoundingClientRect()
        const x = clientX - domLeft
        const y = clientY - domTop
        const ctx = this.props.suckerCanvas.getContext('2d')
        const imgData = ctx.getImageData(
            Math.min(x, width - 1),
            Math.min(y, height - 1),
            1,
            1
        )
        let [r, g, b, a] = imgData.data
        a = parseFloat((a / 255).toFixed(2))
        const style = this.state.suckerPreview.style
        Object.assign(style, {
            position: 'absolute',
            left: clientX + 20 + 'px',
            top: clientY - 36 + 'px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '2px solid #fff',
            boxShadow: '0 0 8px 0 rgba(0, 0, 0, 0.16)',
            background: `rgba(${r}, ${g}, ${b}, ${a})`,
            zIndex: 95 // 吸管的小圆圈预览色的层级不能超过颜色选择器
        })
        if (
            clientX >= this.props.suckerArea[0] &&
            clientY >= this.props.suckerArea[1] &&
            clientX <= this.props.suckerArea[2] &&
            clientY <= this.props.suckerArea[3]
        ) {
            style.display = ''
        } else {
            style.display = 'none'
        }
    }

    suckColor(dom) {
        if (dom && dom.tagName !== 'CANVAS') {
            return
        }

        const suckerPreview = document.createElement('div')
        this.setState({
            suckerPreview
        })
        document.body.appendChild(suckerPreview)

        document.addEventListener('mousemove', this.mousemoveHandler)
        document.addEventListener('mouseup', this.mousemoveHandler)

        dom.addEventListener('click', e => {
            const { clientX, clientY } = e
            const { top, left, width, height } = dom.getBoundingClientRect()
            const x = clientX - left
            const y = clientY - top
            const ctx = dom.getContext('2d')
            const imgData = ctx.getImageData(
                Math.min(x, width - 1),
                Math.min(y, height - 1),
                1,
                1
            )
            let [r, g, b, a] = imgData.data
            a = parseFloat((a / 255).toFixed(2))
            this.props.selectSucker({ r, g, b, a })
        })
    }
}

Sucker.defaultProps = {
    suckerCanvas: null,
    suckerArea: [],
    openSucker: () => {},
    selectSucker: () => {}
}

Sucker.propTypes = {
    suckerCanvas: PropTypes.object,
    suckerArea: PropTypes.array,
    openSucker: PropTypes.func,
    selectSucker: PropTypes.func
}
