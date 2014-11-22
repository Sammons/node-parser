var parser = require('./index.js');
var fs = require('fs');

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
	 [ 'LPAREN', 'MATH_EXP', 'RPAREN' ],
	 [ 'MATH_EXP', 'OP', 'MATH_EXP'   ],
	 [ 'NUMBER' ] 
	 ]
}


parser.analyze( ''+fs.readFileSync('input.txt'), tokens, non_terminals, function( emitter, tree ) {
	emitter.on( 'MATH_EXP', function( op ) {
		console.log( 'MATH_EXP', op )
	})
	//console.log('root node:',JSON.stringify(tree).replace('{','\n{'))
} )