module.exports = {
	presets: [
		require('babel-preset-es2015'),
		require('babel-preset-react')
	],
	plugins: [
		require('babel-plugin-transform-class-properties'),
		// require('babel-plugin-transform-decorators-legacy'),
		require('babel-plugin-transform-object-rest-spread')
	]
}