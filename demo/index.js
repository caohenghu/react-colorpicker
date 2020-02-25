import App from './App'

ReactDOM.render(<App />, document.getElementById('app'))

if (module.hot) {
    // 实现热更新
    module.hot.accept()
}
