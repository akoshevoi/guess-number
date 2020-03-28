module.exports = {
	parser: 'babel-eslint',
	plugins: ['react', 'jsx-a11y', 'import'],
	extends: ['plugin:react/recommended', 'airbnb-base'],
	rules: {
		quotes: [2, 'single', { avoidEscape: true }],
		'arrow-parens': [2, 'as-needed'],
		'no-param-reassign': 0,
		'comma-dangle': 0,
		'react/no-deprecated': 0,
		'linebreak-style': 0,
		'global-require': 0,
		'no-mixed-operators': 0,
		'no-confusing-arrow': 0,
		'no-tabs': 0,
		'no-use-before-define': 0,
		indent: 0,
		'spaced-comment': 0,
		camelcase: 0,
		'import/prefer-default-export': 0,
		curly: [2, 'all'],
		'no-console': [
			2,
			{
				allow: ['error', 'debug', 'ignoredYellowBox'],
			},
		],
		'import/no-unresolved': [
			2,
			{
				ignore: [
					'.png',
					'.jpg',
					'.jpeg',
					'.svg',
					'/build/',
					'node_modules',
					'/android/',
					'.gradle',
				],
			},
		],
	},
};
