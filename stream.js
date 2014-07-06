var fs = require('fs');
var EventEmitter = require('events').EventEmitter

module.exports = new EventEmitter();

module.exports.analyze = function ( file, tokens, non_terminals, callback ) {
	if (!file) return console.log("not enough args");

	var plaintext = fs.readFileSync(file)+'';
	var backup_plaintext = plaintext;
	var tokens_matched = []

	do {
		var next = next_token(plaintext);
		if (next.seq[0] != '') tokens_matched.push(next)
		plaintext = plaintext.replace(next.seq[0],'');
		plaintext = plaintext.replace(tokens.IGNORE, '')
	} while (next.seq[0] != '');

	if (plaintext != '') {
		console.log("UNRECOGNIZED SYMBOL FOUND: "+plaintext);
		return;
	}

	while (reduce_stack_once(tokens_matched));

	depth_first_traverse( tokens_matched[0] );

	function reduce_stack_once(stack) {
		var matches = [];
		/* for every non-terminal, check the stack */
		for (var i in non_terminals) {
			var match_len = 0; /* aka, offset */
			var pos = 0;
			var seq = non_terminals[i].seq;
			var match = {tok: '', seq: []};
			var found = false;
			while (pos < stack.length) {
				/* check the stack against this non-terminal */
			    if (stack[pos].tok == seq[match_len]) {
			    	match_len++;
			    	if (match_len == seq.length) {
			    		var matching_sequence = stack.splice(pos-1, match_len);
			    		stack.splice(pos-1, 0, (function(){ return {tok:i, seq: matching_sequence} } )());
			    		found = true;
			    	}
			    }
			    pos++;
			    if (found) return true;
			}
		}
		return false;
	}


	function next_token(text) {
		var matches = [];
		for (var i in tokens) {
			var tok_matches = text.match(tokens[i]);
			for (var j in tok_matches) (function(){tok_matches[j] = {tok: i, seq: [ tok_matches[j] ]}})()
			matches = matches.concat(tok_matches);
		}
		var longest = {seq: ['']};
		for (var i in matches) {
			if (matches[i] != null 
				&& matches[i].seq[0] != null 
				&& matches[i].seq[0].length > longest.seq[0].length
			) longest = matches[i];
		}
		return longest;
	}

	function depth_first_traverse( node ) {
		if (node.tok) {
			for (var i in node.seq) depth_first_traverse( node.seq[i] );
			module.exports.emit( node.tok, node.seq )
		}
	}

	return tokens_matched[0];
}

