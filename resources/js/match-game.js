var MatchGame = {};

/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/
$(document).ready(function () {
  var $game = $('#game');
  var cardValues = MatchGame.generateCardValues();
  MatchGame.renderCards(cardValues, $game);
})

/*
  Generates and returns an array of matching card values.
 */

MatchGame.generateCardValues = function () {
  var orderedPairs = generateOrderedReplicated(1, 8, 2);
  var shuffledPairs = shuffle(orderedPairs);
  return shuffledPairs;
};
function generateOrderedReplicated(minValue, maxValue, replicationCount) {
  var orderedPairs = [];
  for (var n = minValue; n <= maxValue; n++) {
    for (var r = 1; r <= replicationCount; r++) {
      orderedPairs.push(n);
    }
  }
  return orderedPairs;
}

function shuffle(array) {
  // Fisher–Yates Shuffle
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

/*
  Converts card values to jQuery card objects and adds them to the supplied game
  object.
*/

MatchGame.renderCards = function (cardValues, $game) {
  var colors = [];
  colors.push('hsl(25, 85%, 65%)');
  colors.push('hsl(55, 85%, 65%)');
  colors.push('hsl(90, 85%, 65%)');
  colors.push('hsl(160, 85%, 65%)');
  colors.push('hsl(220, 85%, 65%)');
  colors.push('hsl(265, 85%, 65%)');
  colors.push('hsl(310, 85%, 65%)');
  colors.push('hsl(360, 85%, 65%)');

  $game.empty();
  $game.data('flippedCards', []);
  $game.data('canFlip', true);

  for (var valueIndex = 0; valueIndex < cardValues.length; valueIndex++) {
    var value = cardValues[valueIndex];
    var color = colors[value - 1];
    var data = {
      value: value,
      color: color,
      isFlipped: false
    };
    var $newCard = $('<div class="col-xs-3 card"></div>');
    $newCard.data(data);

    $game.append($newCard);
  };

  $('.card').click(function () {
    MatchGame.flipCard($(this), $('#game'));
  });

};

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
 */

MatchGame.flipCard = function ($card, $game) {
  if ($card.data('isFlipped')) {
    return;
  }
  
  if (!$game.data('canFlip')){
    return;
  }
  
  $card.css('background-color', $card.data('color'));
  $card.text($card.data('value'));
  $card.data('isFlipped', true);
  
  var flippedCards = $game.data('flippedCards');
  flippedCards.push($card);

  if (flippedCards.length === 2) {
    if (flippedCards[0].data('value') === flippedCards[1].data('value')) {
      var matchCss = {
        backgroundColor: 'rgb(153, 153, 153)',
        color: 'rgb(204, 204, 204)'
      };
      flippedCards[0].css(matchCss);
      flippedCards[1].css(matchCss);
    } else {
      var noMatchCss = {
        backgroundColor: 'rgb(32, 64, 86)'
      };
      $game.data('canFlip', false);
      window.setTimeout(function () {
        flippedCards[0].css(noMatchCss);
        flippedCards[1].css(noMatchCss);
        flippedCards[0].text('');
        flippedCards[0].data('isFlipped', false);
        flippedCards[1].text('');
        flippedCards[1].data('isFlipped', false);
        $game.data('canFlip', true);
      }, 350)
    }
    $game.data('flippedCards', []);
  }
};