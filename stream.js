var fs = require('fs');

var args = process.argv.slice(2);
if (args.length == 0) return console.log("not enough args");

tokens = {
	IF: /^if/,
	LCURL: /^\{/,
	RCURL: /^\}/,
	STRING: /^\".*?\"|^\'.*?\'/,
	MULTILINE_COMMENT: /^\/\*(.|\s)*?\*\//gim,
	COMMENT: /^\/\/.*?$/,
	NUMBER: /^[0-9\.]+/,
	BITSHIFT: /^\>\>|^\<\</,
	STMT_END: /^\n|^\;/,
	IGNORE: /^\s/
}

non_terminals = {

}

var plaintext = fs.readFileSync(args[0])+'';
var backup_plaintext = plaintext;
var tokens_matched = []
var stack = [];

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

function next_token(text, ignore) {
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