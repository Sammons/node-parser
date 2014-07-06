var parser = require('./parser.js');
tokens = {
	NUMBER: /^[0-9\.]+/,
	OP:     /^[\+\-\/\*]/,
	EQUAL:  /^\=\=/,
	ASSIGN: /^\=/,
	LPAREN: /^\(/,
	RPAREN: /^\)/,
	LCURL:  /^\{/,
	RCURL:  /^\}/,
	IGNORE: /^\s/ //necessary to delimit tokens, not tested with other than whitespace
}

non_terminals = {
	MATH_EXP : [ 
	 [ 'NUMBER', 'OP','NUMBER'        ],
	 [ 'LPAREN', 'MATH_EXP', 'RPAREN' ],
	 [ 'MATH_EXP', 'OP', 'MATH_EXP'   ],
	 [ 'MATH_EXP', 'OP', 'NUMBER'     ],
	 [ 'NUMBER', 'OP', 'MATH_EXP'     ] 
	 ]
}

parser.on( 'MATH_EXP', function( op ) {
	console.log( 'MATH_EXP', op )
})

parser.analyze( 'input.txt', tokens, non_terminals, function( tree ) {
	console.log('root node:',JSON.stringify(tree).replace('{','\n{'))
} )