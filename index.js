/*
 To test this effects of these settings on a granular level:
 1) Make a new file in a project that uses this config (./test.js) and write some code in it.
 2) Install @babel/cli into the project
 3) run ./node_modules/.bin/babel ./test.js
 4) See how different options affect the output.
 */

module.exports = function () {
	return {
		presets: [
			/*
			> Without any configuration options, @babel/preset-env behaves
			> exactly the same as @babel/preset-es2015, @babel/preset-es2016
			> and @babel/preset-es2017 together.
			- Via https://babeljs.io/docs/en/next/babel-preset-env.html:

			^ This behavior is ok for now, it's pretty similar to what we
			had before (only es-2015).
			*/
			[require('@babel/preset-env'), {
				useBuiltIns: 'entry',
				corejs: '3.16.1',
				targets: {
					'ie': '11'
				}
			}],
			require('@babel/preset-react'),
			require('@babel/preset-typescript')
		],
		plugins: [
			// Instead of re-defining the helpers inline, it calls `require('@babel/runtime/...')`
			// which saves space.
			//
			// NOTE: This requires that the generated code can find the `@babel/runtime` module
			// since it will require() it. We include it in this package, so it should just
			// work when doing a regular npm install due to flattening.
			// NOTE 2: We added a check for AF_NO_BABEL_RUNTIME so
			// we can turn this plugin off when using webpack, since it inserts 'import'
			// statements even in files that don't use es6 imports (and do module.exports = ...)
			// which webpack doesn't like.
			//
			// NOTE: We don't really need this anymore because we can pass
			// sourceType: 'unambiguous' in the babel options instead.
			(!process.env.AF_NO_BABEL_RUNTIME) && require('@babel/plugin-transform-runtime'),
			// So we can use process.env.NODE_ENV for dead-code elimination.
			require('babel-plugin-transform-inline-environment-variables'),
			///////
			// The order of the two below is important
			// as per https://github.com/babel/babel/issues/4117 (was https://phabricator.babeljs.io/T7140).
			[require('@babel/plugin-proposal-decorators'), { "legacy": true }],
			// So we can do Class x { a = 1 } 
			require('@babel/plugin-proposal-class-properties'),
			require('@babel/plugin-proposal-optional-chaining'),
			require('@babel/plugin-proposal-nullish-coalescing-operator')
			//////
    	].filter(x => !!x)
	}	
}

/* Old config for Babel 6 (for reference).

module.exports = {
	presets: [
		require('babel-preset-es2015'),		<--- Replaced by preset-env
		require('babel-preset-react')
	],
	plugins: [
		require('babel-plugin-syntax-trailing-function-commas'),		<--- (I don't even want this one anymore but...) Included in es-2017, which has been absorbed into preset-env
		require('babel-plugin-transform-async-to-generator'), // Turns async/await to generators		<--- Included in es-2017, which has been absorbed into preset-env
		require('babel-plugin-transform-runtime'), // async/await runtime methods
		require('babel-plugin-transform-inline-environment-variables'), // So we can do process.env.NODE_ENV
		// Yep, '.default' is a workaround. Took me a while to figure it out.
		// In any case, this entire plugin is kind of temporary until
		// babel makes their official decorators plugin work.
		require('babel-plugin-transform-decorators-legacy').default,
		require('babel-plugin-transform-class-properties'),
		// The order of the two above ^ is important as per https://phabricator.babeljs.io/T7140
		require('babel-plugin-transform-object-rest-spread')	<--- Seems to have been absorbed into preset-env
	]
}

*/