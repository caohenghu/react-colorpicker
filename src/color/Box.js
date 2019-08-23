import './box.scss'

export default class Box extends React.PureComponent {
    constructor(props) {
        super(props)
        this.inputColor = this.inputColor.bind(this)
    }

    render() {
        return (
            <div className="color-type">
                <span className="name">{this.props.name}</span>
                <input
                    value={this.props.color}
                    className="value"
                    onChange={this.inputColor}
                />
            </div>
        )
    }

    inputColor(e) {
        this.props.inputColor(e.target.value)
    }
}

Box.defaultProps = {
    name: '',
    color: '',
    inputColor: () => {}
}

Box.propTypes = {
    name: PropTypes.string,
    color: PropTypes.string,
    inputColor: PropTypes.func
}
