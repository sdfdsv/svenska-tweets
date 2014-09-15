var options = {gridSize: Math.round(16 * $('#wordcloud').width() / 1000),
  weightFactor: function (size) {
    return Math.pow(size, 1.0) * $('#wordcloud').width() / 100;
  },
  fontFamily: 'Times, serif',
  hover: function drawBox(item, dimension) {
      if (!dimension) {
        return;
      }
      $("#infoDiv").prop('hidden', false);
      $("#infoDiv").html('<strong>Selected word: </strong>'+item[0]);
  }
}

$(document).ready( function(){
    //Get the canvas
    var c = $('#wordcloud');
    var histogram;

    //Run function when browser resizes
    $(window).resize( respondCanvas );

    function respondCanvas(){ 
        var width = $("#canvasDiv").width();
        c.attr('width', width ); //max width
        c.attr('height', 0.62*width ); //max height

        //Call a function to redraw other content (texts, images etc)
        drawCloud(histogram);
    }

    function populateTable(){ 
        var table = $("#wordCountTable tbody");
        histogram.forEach(function(entry){
          var row = $('<tr></tr>');
          row.append("<td>" + entry[0] + "</td><td>" + entry[1] + "</td>");
          if(entry[1] < 5) 
            row.addClass('hiddenRow');
          table.append(row);

        })
        
    }

var getHistogram = function(str) {
  words = str.toLowerCase().replace(/[^a-zåäö\-]/g, " ").split(" ")
  hist = {}
  for (i in words) {
    if (words[i].length > 1) hist[words[i]] ? hist[words[i]] += 1 : hist[words[i]] = 1;
  }
  var sortable = [];
  for (var i in hist)
    if (hist[i] > 1) sortable.push([i, hist[i]])
  sortable.sort(function(a, b) {
    return b[1] - a[1]
  })
  return sortable;
}

var getTweets = function() {
  $.ajax({
    url: 'http://svenska-tweets.herokuapp.com/1.1/search/tweets.json?q=lang%3Asv&count=100',
    dataType: 'jsonp',
    success: function(tweets) {
      console.log(tweets);
      var tweetsText = '';
      $.each(tweets.statuses, function(){
        tweetsText += this.text + ' ';
      });
      console.log(getHistogram(tweetsText));
      histogram = getHistogram(tweetsText);

      populateTable();
      respondCanvas();
    }
  });
}

var drawCloud = function(hist){
  options.list = hist;
  WordCloud(document.getElementById('wordcloud'), options);
}

var moreTable = function(){
  $('.hiddenRow').toggleClass('hiddenRow');
}

$('#redrawBtn').click(respondCanvas);
$('#tableToggleBtn').click(moreTable);
    //Initial call 
    getTweets();

});



