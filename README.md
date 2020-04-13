# Database Assignment MongoDB

## Provide implementation of map and reduce function
    var mapFunc = function () {
    if (this.entities != undefined) {
        for (i = 0; i < this.entities.hashtags.length; i++) {
            var ht = this.entities.hashtags[i].text;
            emit(ht, 1);
        }
    }
    }

    var reduceFunction = function (ht, values) {
    count = 0;
    for (let i = 0; i < values.length; i++) {
        count += values[i];
    }
    return count;
    }

    const mapReduce1 = async function (db, callback) {

    let collection = await db.collection('tweets');
    await collection.mapReduce(mapFunc,reduceFunction,
        {
            //Writing collection to DB with specified name
            out: { replace: "hashtag_results" }

            //In memory collection
            //out: {inline: 1 },
        }
    )
    //Get data from DB and sort and find top 10
    topTen(db,callback);
    //Finding top 10 from the in memory collection
    //console.log(await myCollection.sort((a,b) => b.value - a.value).slice(0,10));
    }


##  Provide execution command for running MapReduce

    const MongoClient = require('mongodb').MongoClient;
    const assert = require('assert');
    const url = 'mongodb://localhost:27017';
    const dbName = 'local';
    const client = new MongoClient(url, { useUnifiedTopology: true });

    client.connect((err) => {
        assert.equal(null, err);
        console.log('connected to MongoDB server');
        const db = client.db(dbName);
    
        mapReduce1(db, (() => {
            client.close();
        }));
    });



## Provide top 10 recorded out of the sorted result
    Found the following records, sorted them and took top 10
    [ 
    { _id: 'FCBLive', value: 27 },
    { _id: 'AngularJS', value: 21 },
    { _id: 'nodejs', value: 20 },
    { _id: 'LFC', value: 19 },
    { _id: 'EspanyolFCB', value: 18 },
    { _id: 'IWCI', value: 16 },
    { _id: 'webinar', value: 16 },
    { _id: 'javascript', value: 14 },
    { _id: 'GlobalMoms', value: 14 },
    { _id: 'RedBizUK', value: 12 }
    ]






