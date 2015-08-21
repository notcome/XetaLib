var mainContainer  = document.getElementById('main-container');
var notesContainer = document.getElementById('notes-container');

function makeSideNoteNode (content, anchor) {
  var node = document.createElement('div');
  node.className = 'note-node';
  node.innerHTML = content;

  var offsetTop = anchor.offsetTop - mainContainer.offsetTop;// + notesContainer.offsetTop;
  node.dataset.offsetTop = offsetTop;
  node.setAttribute('style', `top: ${offsetTop}px`);
  return node;
}

function makeDefinitionNode (termNode) {
  var term       = termNode.dataset.term;
  var definition = termNode.dataset.definition;

  var html = `<dl class="neword"><dt>${term}</dt><dd>${definition}</dd></dl>`;
  return makeSideNoteNode(html, termNode);
}

function genMakeMarginNoteNode () {
  var $notes = document.getElementsByClassName('js-marginnote-content');
  var notes  = {};
  Array.from($notes).forEach(function (node) {
    notes[node.dataset.id] = node.innerHTML;
  });

  return function (anchorNode) {
    var id = anchorNode.dataset.id;
    if (!notes.hasOwnProperty(id))
      return;

    return makeSideNoteNode(notes[id], anchorNode);
  }
}

function reflowNotes () {
  var notes = notesContainer.children;
  for (var i = 1; i < notes.length; i ++) {
    var last = notes[i - 1];
    var curr = notes[i];

    var offsetTopUpperBound = last.offsetTop + last.offsetHeight;
    if (curr.offsetTop >= offsetTopUpperBound)
      continue;
    curr.setAttribute('style', `top: ${offsetTopUpperBound}px`);
  }
}

var mainContainerHeight = -1;

function makeSideNote () {
  if (mainContainerHeight == mainContainer.offsetHeight)
    return;

  notesContainer.innerHTML = '';
  var newords       = document.getElementsByClassName('js-neword');
  var definitions   = Array.from(newords, makeDefinitionNode)
  var marginAnchors = document.getElementsByClassName('js-marginnote-anchor');
  var marginNotes   = Array.from(marginAnchors, genMakeMarginNoteNode());
  var sidenotes     = definitions.concat(marginNotes);

  sidenotes.sort(function (lhs, rhs) {
    return parseInt(lhs.dataset.offsetTop) - parseInt(rhs.dataset.offsetTop);
  });
  sidenotes.forEach(function (node) {
    notesContainer.appendChild(node);
  });
  reflowNotes();
  mainContainerHeight = mainContainer.offsetHeight;
}

(function () {
  var counter = 1;
  function hook () {
    setTimeout(function () {
      if (counter == 20)
        return;

      counter ++;
      makeSideNote();
      hook();
    }, counter * 100);
  }
  hook();
}());
