### Call it what you like

but it is a rudimentary grammar module which can be used when regex just isn't enough.
If you are planning to build a new language, this probably won't get you all the way there, but
it could help.

### How to use it

`npm install --save Sammons/SubjectLogger`

below is the code from the example, essentially define tokens using regex. Then define non terminals as combinations of tokens and non terminals -- note that you may use recursively defined non terminals as seen below, but can run into a loop if things are ambiguous.

Every token in the input file must be defined or an error will result; Brevity was the focus when writing this, and the code base is fairly small and simple. Don't be afraid to jump into the parser.js file and change things!

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
