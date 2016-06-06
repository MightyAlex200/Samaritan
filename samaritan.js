$State = {
    isText: false,
    wordTime: 750, // Time to display a word
    wordAnim: 150, // Time to animate a word
    randomInterval: 18000,
    lastRandomIndex: -1,
    randomTimer: null,
    lastMouseUp: -1
};


var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

var ismobile = 0;
if(isMobile)
{
  ismobile=1.5;
}
else
{
  ismobile=2;
};



console.log(ismobile);

// From Stack Overflow
// http://stackoverflow.com/questions/1582534/calculating-text-width-with-jquery
$.fn.textWidth = function(){
  var html_org = $(this).html();
  var html_calc = '<span>' + html_org + '</span>';
  $(this).html(html_calc);
  var width = $(this).find('span:first').width();
  $(this).html(html_org);
  return width;
};

// http://stackoverflow.com/questions/19491336/get-url-parameter-jquery
function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}

function processMessageFromHash()
{
    var message = decodeURIComponent(window.location.hash.slice(1));
    if (message)
    {
        setTimeout(function(){executeSamaritan(message);}, $State.wordTime);
    }
}

$(document).ready(function(){
    // Cache the jquery things
    $State.triangle = $('#triangle');
    $State.text  = $('#main p');
    $State.line = $('#main hr');

    $State.triangle.css("font-size",ismobile + "em");

    // Start the triangle blinking
    blinkTriangle();

    // URL parameter message
    var urlMsg = getUrlParameter('msg');
    if (urlMsg !== undefined)
    {
        urlMsg = urlMsg.split('%20').join(' ').split('%22').join('').split('%27').join("'");
        $State.phraselist = [urlMsg];
        setTimeout(function(){executeSamaritan(urlMsg);}, $State.wordTime);
    }
    else
    {
      // Message from URL fragment
      processMessageFromHash();
    }

    // Show a new message whenever the URL fragment changes
    $(window).on('hashchange', processMessageFromHash);

    // Store the phrase list in the state
    if ($State.phraselist !== undefined)
      phraselist = phraselist.concat($State.phraselist);
    $State.phraselist = phraselist;

    $(document).bind("mouseup", function(){
        if ((Date.now() - $State.lastMouseUp) <= 500)
        {
            console.log("DblClick");
            if (screenfull.enabled) {
                screenfull.toggle();
            }
        }
        $State.lastMouseUp = Date.now();
    }).bind("click", runRandomPhrase);

    // And do a timed random phrase
    randomTimePhrase();
})

var blinkTriangle = function()
{
    // Stop blinking if samaritan is in action
    if ($State.isText){
        $State.line.css("opacity","1");
        return;
      }
    //$State.line.fadeTo(500, 0).fadeTo(500, 1, blinkTriangle);
    x=Math.floor((Date.now()/500)%2)+0.5;
    //console.log(x);
    //console.log("hello world");
    $State.line.css("opacity",x.toString());
    window.requestAnimationFrame(blinkTriangle);
}

var runRandomPhrase = function()
{
    // Get a random phrase and execute samaritan
    var randomIndex = 0;
    if($State.phraselist.length > 1){
        if(getUrlParameter('random') == 'false'){ //if random parameter is set to false
            if($State.lastRandomIndex+1 != $State.phraselist.length){ //if it's not the last one
                randomIndex = $State.lastRandomIndex+1;
            }
        } else {
            randomIndex = Math.floor(Math.random() * ($State.phraselist.length - 0));
            while (randomIndex == $State.lastRandomIndex)
                randomIndex = Math.floor(Math.random() * ($State.phraselist.length - 0));
        }
    }
    $State.lastRandomIndex = randomIndex;
    executeSamaritan($State.phraselist[randomIndex]);
}

var randomTimePhrase = function()
{
    if ($State.randomTimer !== null)
        clearTimeout($State.randomTimer);
    var randomTime = Math.floor(Math.random() * (3000 - 0));
    randomTime += $State.randomInterval;
    $State.randomTimer = setTimeout( runRandomPhrase, randomTime);
}

var executeSamaritan = function(phrase)
{
    if ($State.isText)
        return;

    $State.isText = true
    var phraseArray = phrase.split(" ");
    // First, finish() the blink animation and
    // scale down the marker triangle
    $State.triangle.finish().animate({
        'font-size': '0em',
        'opacity': '1'
    }, {
        'duration': $State.wordAnim,
        // Once animation triangle scale down is complete...
        'done': function() {
            var timeStart = 0;
            // Create timers for each word
            phraseArray.forEach(function (word, i) {
                var wordTime = $State.wordTime;
                if (word.length > 8)
                    wordTime *= (word.length / 8);
                setTimeout(function(){
                    // Set the text to black, and put in the word
                    // so that the length can be measured
                    $State.text.addClass('hidden').html(word);
                    // Then animate the line with extra padding
                    $State.line.animate({
                        'width' : ($State.text.textWidth() + 18) + "px"
                    }, {
                        'duration': $State.wordAnim,
                        // When line starts anmating, set text to white again
                        'start': $State.text.removeClass('hidden')
                    })
                }, (timeStart + $State.wordAnim));
                timeStart += wordTime;
            });

            // Set a final timer to hide text and show triangle
            setTimeout(function(){
                // Clear the text
                $State.text.html("");
                // Animate trinagle back in
                $State.triangle.finish().animate({
                    'font-size': ismobile + 'em',
                    'opacity': '1'
                }, {
                    'duration': $State.wordAnim,
                    // Once complete, blink the triangle again and animate the line to original size
                    'done': function(){
                        $State.isText = false;
                        randomTimePhrase();

                        blinkTriangle();
                        $State.line.animate({
                            'width' : "30px"
                        }, {
                            'duration': $State.wordAnim,
                            'start': $State.text.removeClass('hidden')
                        })
                    }
                });
            },
            timeStart + $State.wordTime);
        }
    });
}
