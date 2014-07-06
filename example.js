var stream_parser = require('./stream.js');
tokens = {
	ME: /^ben|^sammons|^/i,
	IS: /^is/i,
	POSITIVE: /^neat/i,
	IGNORE: /^\s/ //necessary
}

non_terminals = {
	DESCRIPTOR: { seq: [ 'ME', 'IS' ] },
	COMPLIMENT: { seq: [ 'DESCRIPTOR', 'POSITIVE'] }
}

stream_parser.analyze( 'input.txt', tokens, non_terminals, function( ast ) {} )