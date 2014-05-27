var fs = require('fs');

var args = process.argv.slice(2);
if (args.length == 0) return console.log("not enough args");

var firstFile = fs.readFileSync(args[0],'utf8');


var vocabulary = {
	"WORD"  : /[%&\*^]+/,
	"sVAR"   : /[A-Z\*]+/,
	"lVAR"  : /[a-z]+/,
	"TWOWORDS" : /[a-z]+\s[a-z]+/,
	"TRASH" : /\s+/g// REQUIRED not use *
}

var stack = [];
var grammar = {
	"exp" : {
		match : [[ "WORD" ], ["exp", "WORD"]],
		actions : [ 
			function(terminalTokens) {

			} 
		]
	} 
}

function getRegexpStr(reg) {
	return reg.toString().replace(/^\/|\/.*$/g,'');
}
function trashTrim(str) {
	var rtrash = getRegexpStr(vocabulary["TRASH"]);
	var trtrm = new RegExp(
		"^"+rtrash+"|"+rtrash+"$"
		,'g');
	return str.replace(trtrm, '');
}
function trashTrimFront(str) {
	var rtrash = getRegexpStr(vocabulary["TRASH"]);
	var trtrm = new RegExp(
		"^"+rtrash
		,'g');
	return str.replace(trtrm, '');
}

var tokenStack = [];
var trash = getRegexpStr(vocabulary["TRASH"]);
function processFile(raw) {
	while (raw) {
		raw = trashTrimFront(raw);
		var match = findBestMatch(raw);
		if (match.match) {
			tokenStack.push({word: match.word, val: match.match});
			raw = raw.replace(
				new RegExp("^"+getRegexpStr(vocabulary[match.word])),'')
		} else {
			if (trashTrim(raw).length != 0)
				console.log("INVALID TOKENS:"+raw)
			break;
		}
	}
}
function findBestMatch(rawSet) {
	var longest = {word: '', length: 0};
	for (var word in vocabulary) {
		if (word != "TRASH") {
			var regstr = getRegexpStr(vocabulary[word]);
			var reg = new RegExp("^"+regstr+"("+getRegexpStr(vocabulary["TRASH"])+")");
			var matches = rawSet.match(reg);
			if (matches && matches[0].length > longest.length) {
				longest = {word: word, length: matches[0].length
					, match: trashTrim(matches[0])};
			}
		}
	}
	return longest;
}
processFile(firstFile);

console.log(tokenStack)
// tokenStack = tokenStack.reverse();
var newStack = [];
function processStackOnce() {
	var seq = [];
	var passes = 0;

}

function reduceTokenSeq(seq) {
	var match = '';
	for (var i in grammar) {
		for (var matchSet in grammar[i].match) {
			var tokenSeqSet = grammar[i].match[matchSet];
			var matches = true;
			if (tokenSeqSet.length == seq.length) {
				for (var j = 0; j < tokenSeqSet.length; j++) {
					if (tokenSeqSet[j] != seq[j].word) matches = false;
				}
				if (matches) {
					match = {word: i, val: seq};
					return match;
				}
			}
		}
	}
}
processStackOnce();




