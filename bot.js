var Twitter = require('twitter');
var fs = require('fs');

//connect to twitter
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
 
var params = {screen_name: 'nodejs'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);


    //save tweets to json file
    //tweets come as objects, so we use JSON.stringify method
    //this process helps visualize what is coming in from twitter
    fs.writeFile('tweets.json', JSON.stringify(tweets), (err) => {
        if (err) throw err;
        console.log('New file saved!');
    });
  }
});

//then run node bot.js
//review JSON response
//