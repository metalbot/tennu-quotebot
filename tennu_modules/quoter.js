
var QuoteModule = {
    init: function (client, imports) {
        var cheerio = require('cheerio');
        var Promise = require('bluebird');
        Promise.longStackTraces();
        var request = Promise.promisify(require('request'));
        var Random = require('hrandom');
        var random = new Random();

        return {
            handlers: {
                '!quote': function (command) {
                    var getGoogleUrl = function(searchTerm) {
                        return request('http://www.google.com/search?as_q=' + searchTerm + 
                            '&as_sitesearch=brainyquote.com')
                        .spread(function (response, body) {
                                $ = cheerio.load(body);
                                var googleResult = $('h3.r a').first()[0];
                                if (googleResult) { 
                                    var url = googleResult.attribs.href
                                    url = url.substring(7, url.indexOf(".html") + 5);
                                    return url;
                                } else { 
                                    throw "Couldn't find any quotes";
                                }
                        });

                    };

                    var getQuoteResults = function(url) {
                        client.say(command.channel, url);
                        return request(url)
                        .spread(function(response, body) {
                            if (response && response.statusCode === 200) {
                                $ = cheerio.load(body);
                                var quotes = $('span.bqQuoteLink a'); 
                                if (quotes[0] && quotes[0].children) {
                                   return quotes;
                                } else {
                                    var quote = $('.bq_fq_lrg p')[0].children[0].data;
                                    console.log("Hail Mary: " + quote);
                                    return [{ children: [ { data: quote } ] }];
                                }
                            } else {
                                throw "Unable to parse brainy quote response";
                            }
                        });
                    };

                    var pickResults = function(results) {
                        if (results[0] && results[0].children) {
                            client.say(command.channel, '"' + random.nextElement(results).children[0].data + '"');
                        } else {
                            throw "Couldn't handle result";
                        }
                    }
                    command.args.shift
                    if (command.args.length > 0) {
                        getGoogleUrl(command.args.join('+'))
                        .then(getQuoteResults)
                        .then(pickResults)
                        .catch(function(err) {
                            console.log(err);
                            client.say(command.channel, "Sorry!");
                        });
                    }
                }
            },

            help: {
                'command': [
                    '!quote <some person>',
                    ' ',
                    'Tries to find a quote by a person.'
                ]
            },

            commands: ['quote']
        }
    }
};

module.exports = QuoteModule;

