import App from './App'
// import App from './Test'

ReactDOM.render(<App />, document.getElementById('app'))

if (module.hot) {
    // 实现热更新
    module.hot.accept()
}
