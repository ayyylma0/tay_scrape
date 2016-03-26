var request = require('request');
var cheerio = require('cheerio');
var i = 0;
var postNum = [];
var body = [];
var replies = [];


request('http://boards.4chan.org/pol/thread/68698616', function (error, response, html) {
	if (!error && response.statusCode == 200) {
		var $ = cheerio.load(html);
		$('div.postContainer').each(function(i, element){
			postNum.push($(this).find("[title='Reply to this post']").first().text());
			
			replies.push("n/a");
			var quotes = [];
			$(this).find("blockquote.postMessage a.quotelink").each(function(){
				quotes.push($(this).text().substring(2));
			});
			for (var k = 0;postNum[k];k++){
				for(var j = 0;quotes[j];j++) {
					if(quotes[j] == postNum[k]){
						if(replies[k] == "n/a") replies[k] = postNum[i];
						else {
							replies[k] += ",";
							replies[k] += postNum[i];
						}
					}
				}
			}
			
			$(this).find(".quotelink").remove();
			body.push($(this).find("blockquote.postMessage").text().replace(/"/g , "\\" + '"'));

			i++;
		});
		
		
		for(i=0;postNum[i];i++){
			postNum[i] = '{' + '"' + "postNum" + '"' + ": " + postNum[i];
			body[i] = ", " + '"' + "body" + '"' + ": " + '"' + body[i] + '"';
			if(replies[i] != "n/a") replies[i] = ", " + '"' + "replies" + '"' + ": [" + replies[i] + "]}";
			else replies[i] = ", " + '"' + "replies" + '"' + ": []}";
			console.log(postNum[i] + body[i] + replies[i]);
		}
	}
});