import './app.scss'
import ColorPicker from './color'
import imgCover from './img/cover.jpg'

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.refCover = React.createRef()
        this.changeColor = this.changeColor.bind(this)
        this.openSucker = this.openSucker.bind(this)
        this.changeTheme = this.changeTheme.bind(this)
        this.animationEnd = this.animationEnd.bind(this)
        this.state = {
            color: '#59c7f9',
            suckerCanvas: null,
            suckerArea: [],
            isOpenSucker: false,
            theme: '',
            inAnimation: false
        }
    }

    render() {
        return (
            <div className="hu-page">
                <div className="bg" style={{ background: this.state.color }}>
                    <div className="title">react-colorpicker</div>
                    <div className="cover">
                        <ColorPicker
                            theme={this.state.theme}
                            color={this.state.color}
                            suckerHide={false}
                            suckerCanvas={this.state.suckerCanvas}
                            suckerArea={this.state.suckerArea}
                            changeColor={this.changeColor}
                            openSucker={this.openSucker}
                        />
                        {this.state.isOpenSucker && <img ref={this.refCover} />}
                    </div>
                </div>
                <div className="github">
                    <a
                        href="https://github.com/caohenghu/react-colorpicker"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Fork me on GitHub
                    </a>
                </div>
                <div
                    className={
                        'switch' + (this.state.inAnimation ? ' anim-pull' : '')
                    }
                    onAnimationEnd={this.animationEnd}
                    onClick={this.changeTheme}
                />
            </div>
        )
    }

    changeColor(color) {
        const { r, g, b, a } = color.rgba
        this.setState({
            color: `rgba(${r},${g},${b},${a})`
        })
    }

    openSucker(isOpen) {
        this.setState({
            isOpenSucker: isOpen
        })
        if (isOpen) {
            // 需要等refCover显示后才能取到值
            setTimeout(() => {
                const cover = this.refCover.current
                cover.onload = () => {
                    // 如果已经点击取消了才加载完，则不执行
                    if (!this.state.isOpenSucker) {
                        return
                    }
                    const coverRect = cover.getBoundingClientRect()
                    const canvas = this.createCanvas(cover, coverRect)
                    document.body.appendChild(canvas)
                    this.setState({
                        suckerCanvas: canvas,
                        suckerArea: [
                            coverRect.left,
                            coverRect.top,
                            coverRect.left + coverRect.width,
                            coverRect.top + coverRect.height
                        ]
                    })
                }
                cover.setAttribute('crossorigin', 'Anonymous')
                cover.src = imgCover
            })
        } else {
            this.state.suckerCanvas && this.state.suckerCanvas.remove()
        }
    }

    createCanvas(cover, coverRect) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = coverRect.width
        canvas.height = coverRect.height

        ctx.drawImage(cover, 0, 0, coverRect.width, coverRect.height)
        Object.assign(canvas.style, {
            position: 'absolute',
            left: coverRect.left + 'px',
            top: coverRect.top + 'px',
            opacity: 0
        })
        return canvas
    }

    changeTheme() {
        this.setState({
            theme: this.state.theme ? '' : 'light',
            inAnimation: true
        })
    }

    animationEnd() {
        this.setState({
            inAnimation: false
        })
    }
}
