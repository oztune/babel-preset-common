module.exports = {
	presets: [
		require('babel-preset-react'),
		require('babel-preset-es2015'),
		require('babel-preset-es2016'),
		require('babel-preset-es2017')
	],
	plugins: [
		require('babel-plugin-transform-runtime'), // async/await runtime methods
		require('babel-plugin-transform-inline-environment-variables'),
		// Yep, '.default' is a workaround. Took me a while to figure it out.
		// In any case, this entire plugin is kind of temporary until
		// babel makes their official decorators plugin work.
		require('babel-plugin-transform-decorators-legacy').default,
		require('babel-plugin-transform-class-properties'),
		// The order of the two above ^ is important as per https://phabricator.babeljs.io/T7140
		require('babel-plugin-transform-object-rest-spread')
	]
}
