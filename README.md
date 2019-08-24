# react-colorpicker

## [LiveDemo](https://caohenghu.github.io/react-colorpicker/)

![preview-dark](https://raw.githubusercontent.com/caohenghu/react-colorpicker/master/src/img/preview-dark.jpg)
![preview-light](https://raw.githubusercontent.com/caohenghu/react-colorpicker/master/src/img/preview-light.jpg)

## Install

```bash
$ yarn add @caohenghu/react-colorpicker
```

## Example

```javascript
import ColorPicker from '@caohenghu/react-colorpicker'

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.changeColor = this.changeColor.bind(this)
        this.openSucker = this.openSucker.bind(this)
        this.state = {
            color: '#59c7f9',
            suckerCanvas: null,
            suckerArea: []
        }
    }

    render() {
        return (
            <div style={{background: color}>
                <ColorPicker
                    theme="light"
                    color={this.state.color}
                    suckerHide={false}
                    suckerCanvas={this.state.suckerCanvas}
                    suckerArea={this.state.suckerArea}
                    changeColor={this.changeColor}
                    openSucker={this.openSucker}
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
        if (isOpen) {
            // ... canvas be created, and get the area of canvas
            // this.setState({
            //     suckerCanvas: canvas,
            //     suckerArea:  [x1, y1, x2, y2]
            // })
        } else {
            // this.state.suckerCanvas && this.state.suckerCanvas.remove()
        }
    }
}
```

## Options

| Name               | Type              | Default                                                                                                                                                                                  | Description                             |
| ------------------ | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| theme              | String            | `dark`                                                                                                                                                                                   | `dark` or `light`                       |
| color              | String            | `#000000`                                                                                                                                                                                | `rgba` or `hex`                         |
| colors-default     | Array             | `['#000000', '#FFFFFF', '#FF1900', '#F47365', '#FFB243', '#FFE623', '#6EFF2A', '#1BC7B1', '#00BEFF', '#2E81FF', '#5D61FF', '#FF89CF', '#FC3CAD', '#BF3DCE', '#8E00A7', 'rgba(0,0,0,0)']` | like `['#ff00ff', '#0f0f0f', ...]`      |
| colors-history-key | String            | `react-colorpicker-history`                                                                                                                                                              |
| sucker-hide        | Boolean           | `true`                                                                                                                                                                                   | `true` or `false`                       |
| sucker-canvas      | HTMLCanvasElement | `null`                                                                                                                                                                                   | like `document.createElement('canvas')` |
| sucker-area        | Array             | `[]`                                                                                                                                                                                     | like `[x1, y1, x2, y2]`                 |

## Events

| Name        | Type     | Args   | Description            |
| ----------- | -------- | ------ | ---------------------- |
| changeColor | Function | color  | `{ rgba: {}, hsv: {}}` |
| openSucker  | Function | isOpen | `true` or `false`      |

> if you want use sucker, then `openSucker`, `sucker-hide`, `sucker-canvas`, `sucker-area` is necessary. when you click sucker button, you can click it again or press key of `esc` to exit.
