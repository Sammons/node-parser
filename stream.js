var fs = require('fs');

var args = process.argv.slice(2);
if (args.length == 0) return console.log("not enough args");

tokens = {
	GREETING: /^hello|^salutations|^sup|^what's happening|^what's new|^what's up|^hey|howdy/i,
	ME: /^sammonsbot|^sb|^bot|^ben/i,
	IGNORE: /^\s/ //necessary
}

non_terminals = {
	PERSON_WELCOMING: { seq: [ 'GREETING', 'ME' ] }
}

var plaintext = fs.readFileSync(args[0])+'';
var backup_plaintext = plaintext;
var tokens_matched = []

do {
	var next = next_token(plaintext);
	if (next.match != '') tokens_matched.push(next)
	plaintext = plaintext.replace(next.match,'');
	plaintext = plaintext.replace(tokens.IGNORE, '')
} while (next.match != '');

if (plaintext != '') {
	console.log("UNRECOGNIZED SYMBOL FOUND: "+plaintext);
	return;
}

console.log(tokens_matched)

reduce_stack_once(tokens_matched);
reduce_stack_once(tokens_matched);

console.log(tokens_matched)
function reduce_stack_once(stack) {
	var matches = [];
	/* for every non-terminal, check the stack */
	for (var i in non_terminals) {
		var match_len = 0; /* aka, offset */
		var pos = 0;
		var seq = non_terminals[i].seq;
		var match = {tok: '', seq: []};
		while (pos < stack.length) {
			/* check the stack against this non-terminal */
		    if (stack[pos].tok == seq[match_len]) {
		    	match_len++;
		    	if (match_len == seq.length) {
		    		console.log(non_terminals[i], i);
		    		var matching_sequence = stack.splice(pos, match_len-1);
		    		stack[pos-1] = (function(){ return {tok:i, seq: matching_sequence} } )();
		    	}
		    }
		    pos++;
		}
	}
}


function next_token(text) {
	var matches = [];
	for (var i in tokens) {
		var tok_matches = text.match(tokens[i]);
		for (var j in tok_matches) (function(){tok_matches[j] = {tok: i, match: tok_matches[j]}})()
		matches = matches.concat(tok_matches);
	}
	var longest = {match:''};
	for (var i in matches) {
		if (matches[i] != null 
			&& matches[i].match != null 
			&& matches[i].match.length > longest.match.length
		) longest = matches[i];
	}
	return longest;
}