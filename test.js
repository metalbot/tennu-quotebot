var cheerio = require('cheerio');
var request = require('request');
var Random = require('hrandom');
var random = new Random(Math.floor(Math.random() * 17) + 46);

var url = "";

var getUrl = function(search, command) {
    request.get('http://www.google.com/search?as_q=' + search + '&as_sitesearch=brainyquote.com', 
        function(error, response, body) {
        if (!error && response && response.statusCode === 200) {
            console.log("Got data back...");
            $ = cheerio.load(body);
            test = $('h3.r a').first()[0];
            if (test) { 
                url = test.attribs.href;
                url = url.substring(7, url.indexOf(".html") + 5);
                console.log( url);
                var getQuotes = function(url) { 
                    request.get(url, function(error, response, body) {
                        if (!error && response && response.statusCode === 200) {
                            console.log("Searched for quotes");
                            $ = cheerio.load(body);
                            quotes = $('span.bqQuoteLink a');
                            if (quotes[0] && quotes[0].children) {
                                console.log( '"' + random.nextElement(quotes).children[0].data + '"');
                            }
                        } else {
                            console.log("Something went wrong.");
                            console.log(" Error = " + error);
                            console.log(" Response = " + response);
                            if (response) {
                                console.log(" Status code = " + response.statusCode);
                            }
                        }
                    });
                };
                getQuotes(url);
            } else {
                client.say(command.channel, "Can't find any quotes, sorry");
            }

        } else {
            console.log("Something went wrong " + err);
        }
    });
};







getUrl("panda");

