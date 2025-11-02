module.exports = {
    root: true,
    extends: ['expo', 'plugin:@typescript-eslint/recommended'],
    settings: {
        'import/resolver': {
            alias: {
                map: [['@', './src']],
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
            },
        },
    },
}
