require('dotenv').config()
var Twitter = require('twitter');
var fs = require('fs');

//connect to twitter
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


//tweet options for array
var tweetList = [];

//bot tweet history
var tweetHistory = [];


const botTweet = () => {
    //run a search for 'so cold'
    client.get('search/tweets', {q: 'so cold'}, function(error, tweets, response) {
        
        //save tweets to json file for reviewing
        //tweets come as objects, so we use JSON.stringify method
        //this process helps visualize what is coming in from twitter
        fs.writeFile('tweets.json', JSON.stringify(tweets, null, '\t'), (err) => {
            if (err) throw err;
            console.log('New file saved!');
        });

        //loop through results
        for (tweet in tweets.statuses) {

            //save tweet's information to this object
            let tweetObj = {};
            tweetObj.tweet = tweets.statuses[tweet].text;
            tweetObj.created_at = tweets.statuses[tweet].created_at
            tweetObj.tweet_id = tweets.statuses[tweet].id;
            tweetObj.url = tweets.statuses[tweet].url;
            tweetObj.user = tweets.statuses[tweet].user.screen_name;
            tweetObj.location = tweets.statuses[tweet].user.location;

            //push the object to the array IF the tweet was created with a location
            if (tweetObj.location !== "") {
                tweetList.push(tweetObj);
            }
        }

        //select random array index
        const generateRandom = (array) => {
            return Math.floor(Math.random() * array.length + 1);
        }

        //generates random tweet for bot to put out
        const tweetGen = (tweet) => {
            //prepend tweet statements for each tweet
            var statements = [
                `It's super cold out in ${tweet.location}, thanks @${tweet.user}.`,
                `We're getting word ${tweet.location} is cold AF, thanks @${tweet.user}.`,
                `Bundle up, ${tweet.location}! @${tweet.user} says it's cold out.`,
                `Planet Hoth or ${tweet.location}? It's FREEZING according to @${tweet.user}`,
                `@${tweet.user} is in need of some HEAT over in ${tweet.location} #freezing`,
                `It's too damn cold, ${tweet.location}. Am I right @${tweet.user}?`
            ]

            randomStatement = generateRandom(statements);
            console.log(statements[randomStatement])
            return statements[randomStatement];
        }

        //index of random tweet
        randomTweet = generateRandom(tweetList);

        //tweet selected from tweetList at random index
        chosenTweet = tweetList[randomTweet];

        if (!(chosenTweet in tweetHistory)) {

            //add selected tweet to history array to keep track of potential duplicates
            tweetHistory.push(chosenTweet);

            //bot tweet
            client.post('statuses/update', {status: tweetGen(chosenTweet)}, function(error, tweet, response) {
                if (!error) {
                    console.log('tweeted!');
                } else {
                    console.log(error)
                }
            });
        }
    });
}


botTweet();
setInterval(botTweet, 900000);