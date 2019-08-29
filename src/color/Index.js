import './index.scss'
import { setColorValue, rgb2hex } from './mixin'
import Saturation from './saturation'
import Hue from './hue'
import Alpha from './alpha'
import Preview from './preview'
import Sucker from './sucker'
import Box from './box'
import Colors from './colors'

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props)
        const { r, g, b, a, h, s, v } = setColorValue(this.props.color)

        this.saturation = React.createRef()
        this.hue = React.createRef()
        this.alpha = React.createRef()
        this.preview = React.createRef()
        this.selectSaturation = this.selectSaturation.bind(this)
        this.selectHue = this.selectHue.bind(this)
        this.selectAlpha = this.selectAlpha.bind(this)
        this.inputHex = this.inputHex.bind(this)
        this.inputRgba = this.inputRgba.bind(this)
        this.setText = this.setText.bind(this)
        this.openSucker = this.openSucker.bind(this)
        this.selectSucker = this.selectSucker.bind(this)
        this.selectColor = this.selectColor.bind(this)
        this.state = {
            hueWidth: 15,
            hueHeight: 152,
            previewHeight: 30,
            modelRgba: `${r}, ${g}, ${b}, ${a}`,
            modelHex: rgb2hex({ r, g, b, a }, true),
            r,
            g,
            b,
            a,
            h,
            s,
            v
        }
    }

    render() {
        return (
            <div
                className={
                    'hu-color-picker' + (this.isLightTheme ? ' light' : '')
                }
                style={{ width: this.totalWidth + 'px' }}
            >
                <div className="color-set">
                    <Saturation
                        ref={this.saturation}
                        color={this.rgbString}
                        hsv={this.hsv}
                        size={this.state.hueHeight}
                        selectSaturation={this.selectSaturation}
                    />
                    <Hue
                        ref={this.hue}
                        hsv={this.hsv}
                        width={this.state.hueWidth}
                        height={this.state.hueHeight}
                        selectHue={this.selectHue}
                    />
                    <Alpha
                        ref={this.alpha}
                        rgba={this.rgba}
                        width={this.state.hueWidth}
                        height={this.state.hueHeight}
                        selectAlpha={this.selectAlpha}
                    />
                </div>
                <div
                    style={{ height: this.state.previewHeight + 'px' }}
                    className="color-show"
                >
                    <Preview
                        ref={this.preview}
                        color={this.rgbaString}
                        width={this.previewWidth}
                        height={this.state.previewHeight}
                    />
                    {!this.props.suckerHide && (
                        <Sucker
                            suckerCanvas={this.props.suckerCanvas}
                            suckerArea={this.props.suckerArea}
                            openSucker={this.openSucker}
                            selectSucker={this.selectSucker}
                        />
                    )}
                </div>
                <Box
                    name="HEX"
                    color={this.state.modelHex}
                    inputColor={this.inputHex}
                />
                <Box
                    name="RGBA"
                    color={this.state.modelRgba}
                    inputColor={this.inputRgba}
                />
                <Colors
                    colorsDefault={this.props.colorsDefault}
                    colorsHistoryKey={this.props.colorsHistoryKey}
                    selectColor={this.selectColor}
                    getCurrentColor={this.getCurrentColor}
                />
            </div>
        )
    }

    componentDidUpdate(nextProps, nextState) {
        if (
            this.state.r !== nextState.r ||
            this.state.g !== nextState.g ||
            this.state.b !== nextState.b ||
            this.state.a !== nextState.a
        ) {
            this.props.changeColor({
                rgba: this.rgba,
                hsv: this.hsv
            })
        }
    }

    get isLightTheme() {
        return this.props.theme === 'light'
    }

    get totalWidth() {
        return this.state.hueHeight + (this.state.hueWidth + 8) * 2
    }

    get previewWidth() {
        return (
            this.totalWidth -
            (this.props.suckerHide ? 0 : this.state.previewHeight)
        )
    }

    get rgba() {
        return {
            r: this.state.r,
            g: this.state.g,
            b: this.state.b,
            a: this.state.a
        }
    }

    get hsv() {
        return {
            h: this.state.h,
            s: this.state.s,
            v: this.state.v
        }
    }

    get rgbString() {
        const { r, g, b } = this.state
        return `rgb(${r}, ${g}, ${b})`
    }

    get rgbaStringShort() {
        const { r, g, b, a } = this.state
        return `${r}, ${g}, ${b}, ${a}`
    }

    get rgbaString() {
        return `rgba(${this.rgbaStringShort})`
    }

    get hexString() {
        return rgb2hex(this.rgba, true)
    }

    selectSaturation(color) {
        const { r, g, b, h, s, v } = setColorValue(color)
        this.setState({ r, g, b, h, s, v })
        this.setText()
        setTimeout(() => {
            this.alpha.current.renderColor()
            this.preview.current.renderColor()
        })
    }

    selectHue(color) {
        const { r, g, b, h, s, v } = setColorValue(color)
        this.setState({ r, g, b, h, s, v })
        this.setText()
        setTimeout(() => {
            this.saturation.current.renderColor()
            this.saturation.current.renderSlide()
            this.alpha.current.renderColor()
            this.preview.current.renderColor()
        })
    }

    selectAlpha(a) {
        this.setState({ a: a })
        this.setText()
        setTimeout(() => {
            this.preview.current.renderColor()
        })
    }

    inputHex(color) {
        const { r, g, b, a, h, s, v } = setColorValue(color)
        this.setState({
            r,
            g,
            b,
            a,
            h,
            s,
            v,
            modelHex: color,
            modelRgba: this.rgbaStringShort
        })
        setTimeout(() => {
            this.saturation.current.renderColor()
            this.saturation.current.renderSlide()
            this.hue.current.renderSlide()
            this.alpha.current.renderColor()
            this.preview.current.renderColor()
        })
    }

    inputRgba(color) {
        const { r, g, b, a, h, s, v } = setColorValue(color)
        this.setState({
            r,
            g,
            b,
            a,
            h,
            s,
            v,
            modelHex: this.hexString,
            modelRgba: color
        })
        setTimeout(() => {
            this.saturation.current.renderColor()
            this.saturation.current.renderSlide()
            this.hue.current.renderSlide()
            this.alpha.current.renderColor()
            this.alpha.current.renderSlide()
            this.preview.current.renderColor()
        })
    }

    setText() {
        this.setState({
            modelHex: this.hexString,
            modelRgba: this.rgbaStringShort
        })
    }

    openSucker(isOpen) {
        this.props.openSucker(isOpen)
    }

    selectSucker(color) {
        const { r, g, b, a, h, s, v } = setColorValue(color)
        this.setState({ r, g, b, a, h, s, v })
        this.setText()
        setTimeout(() => {
            this.saturation.current.renderColor()
            this.saturation.current.renderSlide()
            this.hue.current.renderSlide()
            this.alpha.current.renderColor()
            this.alpha.current.renderSlide()
            this.preview.current.renderColor()
        })
    }

    selectColor(color) {
        const { r, g, b, a, h, s, v } = setColorValue(color)
        this.setState({ r, g, b, a, h, s, v })
        this.setText()
        setTimeout(() => {
            this.saturation.current.renderColor()
            this.saturation.current.renderSlide()
            this.hue.current.renderSlide()
            this.alpha.current.renderColor()
            this.alpha.current.renderSlide()
            this.preview.current.renderColor()
        })
    }

    getCurrentColor() {
        return this.rgbaString
    }
}

Index.defaultProps = {
    color: '#000000',
    theme: 'dark',
    suckerHide: true,
    suckerCanvas: null, // HTMLCanvasElement
    suckerArea: [],
    colorsDefault: [
        '#000000',
        '#FFFFFF',
        '#FF1900',
        '#F47365',
        '#FFB243',
        '#FFE623',
        '#6EFF2A',
        '#1BC7B1',
        '#00BEFF',
        '#2E81FF',
        '#5D61FF',
        '#FF89CF',
        '#FC3CAD',
        '#BF3DCE',
        '#8E00A7',
        'rgba(0,0,0,0)'
    ],
    colorsHistoryKey: 'react-colorpicker-history',
    changeColor: () => {},
    openSucker: () => {}
}

Index.propTypes = {
    color: PropTypes.string,
    theme: PropTypes.string,
    suckerHide: PropTypes.bool,
    suckerCanvas: PropTypes.object, // HTMLCanvasElement
    suckerArea: PropTypes.array,
    colorsDefault: PropTypes.array,
    colorsHistoryKey: PropTypes.string,
    changeColor: PropTypes.func,
    openSucker: PropTypes.func
}
