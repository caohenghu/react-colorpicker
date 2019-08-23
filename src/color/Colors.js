import './colors.scss'
import { createAlphaSquare } from './mixin'

export default class Colors extends React.PureComponent {
    constructor(props) {
        super(props)
        this.selectColor = this.selectColor.bind(this)
        this.setColorsHistory = this.setColorsHistory.bind(this)
        this.state = {
            imgAlphaBase64: createAlphaSquare(4).toDataURL(),
            colorsHistory:
                JSON.parse(localStorage.getItem(this.props.colorsHistoryKey)) ||
                []
        }
    }

    render() {
        const defaultColors = this.props.colorsDefault.map(item => (
            <li
                key={item}
                className="item"
                onClick={this.selectColor.bind(this, item)}
            >
                <div
                    style={{
                        background: `url(${this.state.imgAlphaBase64})`
                    }}
                    className="alpha"
                />
                <div style={{ background: item }} className="color" />
            </li>
        ))
        const historyColors = this.state.colorsHistory.map(item => (
            <li
                key={item}
                className="item"
                onClick={this.selectColor.bind(this, item)}
            >
                <div
                    style={{
                        background: `url(${this.state.imgAlphaBase64})`
                    }}
                    className="alpha"
                />
                <div style={{ background: item }} className="color" />
            </li>
        ))
        return (
            <div>
                <ul className="colors">{defaultColors}</ul>
                {!!this.state.colorsHistory.length && (
                    <ul className="colors history">{historyColors}</ul>
                )}
            </div>
        )
    }

    componentWillUnmount() {
        const color = this.props.getCurrentColor()
        this.setColorsHistory(color)
    }

    selectColor(color) {
        this.props.selectColor(color)
    }

    setColorsHistory(color) {
        if (!color) {
            return
        }
        const colors = this.state.colorsHistory
        const index = colors.indexOf(color)
        if (index >= 0) {
            colors.splice(index, 1)
        }
        if (colors.length >= 8) {
            colors.length = 7
        }
        colors.unshift(color)
        this.setState({
            colorsHistory: colors
        })
        localStorage.setItem(
            this.state.colorsHistoryKey,
            JSON.stringify(colors)
        )
    }
}

Colors.defaultProps = {
    colorsDefault: [],
    colorsHistoryKey: '',
    selectColor: () => {},
    getCurrentColor: () => {}
}

Colors.propTypes = {
    colorsDefault: PropTypes.array,
    colorsHistoryKey: PropTypes.string,
    selectColor: PropTypes.func,
    getCurrentColor: PropTypes.func
}
