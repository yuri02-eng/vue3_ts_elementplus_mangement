// babel.config.js
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    browsers: ['last 2 versions', 'not ie <= 11']
                },
                useBuiltIns: 'usage',
                corejs: 3
            }
        ]
    ],
    plugins: ['@babel/plugin-transform-runtime']
};