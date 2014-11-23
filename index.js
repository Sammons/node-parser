var fs = require('fs');
var EventEmitter = require('events').EventEmitter


module.exports.analyze = function ( input, tokens, non_terminals, callback ) {

  var emitter = new EventEmitter();
  // read in all of the plaintext
  var plaintext = input;

  // the stack
  var tokens_matched = []

  do { // attempt to identify all of the tokens in the plaintext
     // stops once it fails to find more, so bad tokens kill it
    var next = next_token(plaintext);
    if (next.seq[0] != '') tokens_matched.push(next)
    plaintext = plaintext.replace(next.seq[0],'');
    plaintext = plaintext.replace(tokens.IGNORE, '')
  } while (next.seq[0] != '');

  if (plaintext != '') {
    console.log("UNRECOGNIZED SYMBOL FOUND: "+plaintext);
    return;
  }

  // reduce the stack by the grammar defined by the
  // non-terminals, naturally forms a tree since
  // reduction operations push all children into 
  // a new single node
  while (reduce_stack_once(tokens_matched));
  
  if (callback) callback( emitter, tokens_matched[0]);

  // traverse the tree,
  // emitting the non terminal name and
  // passing the sequence of tokens/matches
  // which are its children
  for (var root_node in tokens_matched)
    traverse( tokens_matched[ root_node ] );

  function reduce_stack_once(stack) {
    var matches = [];
    /* for every non-terminal, check the stack */
    for (var j in non_terminals) {
      // each non_terminal has an array of sequences
      // each of these sequences being tokens which
      // create a match for this non-terminal
      var sequences = non_terminals[j]
        , nterm = j;

      // check through each sequence which might match this
      // non-terminal
      for (var k in sequences) {
        var potential_seq = sequences[k];

        // for every token making up this candidate sequence
        // check if it matches (the whole sequence must match)
        // for a non-terminal to reduce these elements 
        for (var i in potential_seq) {
          var match_len = 0              // aka, offset from beginning of match 
            , pos = 0                    // current position to check for next in sequence
            , match = {tok: '', seq: []} // the actual match object, contains literals and/or tokens
            , found = false;             // has the whole non-terminal been matched

          // iterate over every character checking for matches, once we find one
          // we jump to the end of it and continue until either there is no match
          // or we find one
          while (pos < stack.length) {
            // check the stack to see if the non-terminal is a match
              if (stack[pos].tok == potential_seq[match_len]) {
                match_len++;
                if (match_len == potential_seq.length) { // success
                  
                  // remove the matching sequence
                  var matching_sequence = stack.splice(pos-match_len+1, match_len);
                  console.log(matching_sequence)
                  stack.splice( // insert the new non-terminal containing the sequence
                      pos-match_len+1
                    , 0
                    , (function(){ return {tok:nterm, seq: matching_sequence} } )()
                    ); 
                  found = true;
                }
              }
              else if (found == false) {
                match_len = 0;
              }
              pos++;
              if (found) return true;
          }
        }
      }
    }
    return false;
  }

  // attempts to find a matching token in text
  // returns a match object which contains the literal which matched it
  function next_token(text) {
    var matches = [];
    // check each token
    for (var i in tokens) {
      // see if this token's regex matches
      var tok_matches = text.match(tokens[i]);
      if (tok_matches)
        tok_matches[0] = {tok: i, seq: [ tok_matches[0] ]}
      else
        tok_matches = []
      // add this match object to the bucket if it succeeded
      matches = matches.concat(tok_matches);
    }
    // the longest match is what we take
    // so this is that variable
    var longest = {seq: ['']};

    // take each match and find the longest,
    // that is our next token
    for (var i in matches) {
      if (matches[i] != null
        && matches[i].seq
        && matches[i].seq[0] != null 
        && matches[i].seq[0].length > longest.seq[0].length
      ) longest = matches[i];
    }
    return longest;
  }

  // traverse the end tree and emit events
  function traverse( node ) {
    tmp = [];
    console.log(JSON.stringify(node))

    if (node.tok)
    for (var i in node.seq)
    {
      tmp.push( node.seq[i] );
    }

    while (tmp.length > 0)
    {
      var cur_node = tmp.shift();
      if (cur_node.tok){
        emitter.emit( cur_node.tok, cur_node.seq )
        for (var i in cur_node.seq) {
          tmp.push( cur_node.seq[i] )
        }
      }
      
    }
  }

}