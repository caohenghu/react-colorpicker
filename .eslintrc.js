module.exports = {
    env: {
        browser: true,
        node: true,
        commonjs: true,
        es6: true
    },
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: [
        // 'html'
        'react'
    ],
    globals: {
        React: true,
        ReactDOM: true,
        PropTypes: true
    },
    settings: {
        react: {
            createClass: 'createReactClass', // Regex for Component Factory to use,
            // default to "createReactClass"
            pragma: 'React', // Pragma to use, default to "React"
            version: 'detect', // React version. "detect" automatically picks the version you have installed.
            // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
            // default to latest and warns if missing
            // It will default to "detect" in the future
            flowVersion: '0.53' // Flow version
        },
        propWrapperFunctions: [
            // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
            'forbidExtraProps',
            { property: 'freeze', object: 'Object' },
            { property: 'myFavoriteWrapper' }
        ],
        linkComponents: [
            // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
            'Hyperlink',
            { name: 'Link', linkAttribute: 'to' }
        ]
    },
    rules: {
        // indent: [
        //     'error',
        //     4,
        //     {
        //         SwitchCase: 1
        //     }
        // ],
        // 'linebreak-style': ['error', 'unix'],
        // quotes: ['error', 'single'],
        // semi: ['error', 'never']
        // 'object-curly-spacing': ['error', 'always']
    }
}
