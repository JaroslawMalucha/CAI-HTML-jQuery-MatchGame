var MatchGame = {};

/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/
$(document).ready(function () {
  MatchGame.RestartGame();
  $('button.restart-btn').click(function () {
    MatchGame.RestartGame();
  })
  startTime();
})

MatchGame.RestartGame = function () {
  var $game = $('#game');
  $game.data('matchedCount', 0);
  $('p.score').text('Your score is: ' + 0);
  var cardValues = MatchGame.generateCardValues();
  $game.data('timeStarted', new Date());
  $game.data('stopElapsed', false);
  elapsedTime($game);
  MatchGame.renderCards(cardValues, $game);

}


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
  $game.data('allCards', []);

  var allCards = [];
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
    allCards.push($newCard);
    $game.append($newCard);
  };

  $game.data('allCards', allCards);

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

  if (!$game.data('canFlip')) {
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
      var matchedCount = $game.data('matchedCount');
      matchedCount++;
      $game.data('matchedCount', matchedCount);
      $('p.score').text('Your score is: ' + matchedCount);
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

  MatchGame.AllMatched($game);
};

MatchGame.AllMatched = function ($game) {
  var allCards = $game.data('allCards');
  var AllMatched = false;
  var allCount = allCards.length;
  var flippedCount = 0;
  allCards.forEach(element => {
    if (element.data('isFlipped')) {
      flippedCount++;
    }
  });
  if (flippedCount === allCount) {
    $game.data('stopElapsed', true);
    alert("You won");
  }
  //alert("flippedCount: " + flippedCount);
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  // add a zero in front of numbers<10
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('time').innerHTML = "Time: " + h + ":" + m + ":" + s;
  t = setTimeout(function () {
    startTime();
  }, 500);
}

function elapsedTime($game) {
  if ($game.data('stopElapsed')) {
    return;
  }
  var timeStarted = $game.data('timeStarted');
  var timeElapsed = new Date() - timeStarted;
  document.getElementById('timeElapsed').innerHTML = Math.floor(timeElapsed / 1000) + "s";
  t = setTimeout(function () {
    elapsedTime($game);
  }, 500);
}