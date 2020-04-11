const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'testdb';
const client = new MongoClient(url);

client.connect((err) => {
    assert.equal(null, err);
    console.log('connected to MongoDB server');
    const db = client.db(dbName);
    mapReduce1(db, (() => {
        client.close();
    }));

});

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


const mapReduce1 = async function(db, callback){
    //const tweetCollection = db.collection('tweets');
    // map reduce ( map, reduce , query, output)
    let myCollection = await db.collection('tweets').mapReduce(
        mapFunc,
        reduceFunction,
        { 
          //Writing collection to DB with specified name
          out: {replace: "hashtag_results"}

          //In memory collection
          //out: {inline: 1 },
        }
    )
    //Get data from DB and sort and find top 10
    console.log(await db.collection('hashtag_results').find());

    //Finding top 10 from the in memory collection
    //console.log(await myCollection.sort((a,b) => b.value - a.value).slice(0,10));

    callback();
}