const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

//conn URL
const url = 'mongodb://localhost:27017';

//DB Name
const dbName = 'testdb';

const client = new MongoClient(url);

//connect


client.connect((err) => {
    assert.equal(null, err);
    console.log('connected to MongoDB server');
    const db = client.db(dbName);
    mapReduce1(db, (() => {
        client.close();
    }));

});

const mapReduce = function(db, callback){
    const tweetCollection = db.collection('tweets');
    tweetCollection.find({}).toArray((err, res) => {
        var hashtagArray = [];
        for (var i = 0; i < res.length; i++){
            if(res[i].entities != undefined) {
                for (var j = 0; j < res[i].entities.hashtags.length; j++){
                    //console.log(res[i].entities.hashtags[j].text)
                    hashtagArray.push(res[i].entities.hashtags[j].text);
                }
            }

        }
        var dict = new Object();
        for ( var i = 0; i < hashtagArray.length; i++){
            if(dict.hasOwnProperty(hashtagArray[i])){
                dict[hashtagArray[i]] += 1;
            }else{
                dict[hashtagArray[i]] = 1;
            }
        }

        var arr = [];
        for (var p in dict) {
            arr.push({hashtag: p, count: dict[p]});
        }
        arr.sort(function(a,b){return b.count - a.count});
        console.log(arr.slice(0,10));
        callback(arr);
    });
}


var mapFunc = function(){
    if(this.entities != undefined){
        for (i = 0; i < this.entities.hashtags.length; i++){
            var ht = this.entities.hashtags[i].text;
            emit(ht, 1);
        }
    }
}

var reduceFunction = function(ht,values){
    count = 0;
    for (let i = 0; i < values.length; i++) {
        count += values[i];   
    }
    return count;
}


const mapReduce1 = function(db, callback){
    //const tweetCollection = db.collection('tweets');
    // map reduce ( map, reduce , query, output)
    db.collection('tweets').mapReduce(
        mapFunc,
        reduceFunction,
        { 
          out: "hashtag_results",
          sort: {value: -1},
          limit: 10
        }
    )

    callback([]);
}




