const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000;


//middleware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://studyMate:ypoj2aM2Cz88TmFi@laa.0ndrbne.mongodb.net/?appName=Laa";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})


async function run(params) {
  try {
    await client.connect();

    const db = client.db('study_mate');
    const mateCollection = db.collection('mates');
    const connectionCollection = db.collection('connection');
    const usersCollection = db.collection('users');



    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const email = req.body.email;
      const query = { email: email }
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        res.send({ message: 'user already exits. do not need to insert again' })
      }
      else {
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
      }
    })



    app.get('/mates', async (req, res) => {
      console.log(req.query)
      const email = req.query.email;
      const query = {}
      if (email) {
        query.email = email;
      }

      const cursor = mateCollection.find(query);
      const result = await cursor.toArray();
      res.send(result)
    });

    app.get('/latest-mates', async (req, res) => {
      const cursor = mateCollection.find().sort({ rating: -1 }).limit(3);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/mates/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await mateCollection.findOne(query);
      res.send(result);
    })


    app.post('/mates', async (req, res) => {
      const newMate = req.body;
      const result = await mateCollection.insertOne(newMate);
      res.send(result);
    })

    app.patch('/mates/:id', async (req, res) => {
      const id = req.params.id;
      const updatedMates = req.body;
      const query = { _id: new ObjectId(id) }
      const update = {
        $set: {
          name: updatedMates.name
        }
      }

      const result = await mateCollection.updateOne(query, update)
      res.send(result);
    })

    app.delete('/mates/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await mateCollection.deleteOne(query);
      res.send(result);
    })

    // my connection related apis

    // app.get('/connection', async (req, res) => {
    //   const email = req.query.email;
    //   const query = {};
    //   if (email) {
    //     query.buyer_email = email;
    //   }

    //   const cursor = connectionCollection.find(query);
    //   const result = await cursor.toArray();
    //   res.send(result);
    // })

    // app.post('/connection', async (req, res) => {
    //   const newConnection = req.body
    //   const result = await connectionCollection.insertOne(newConnection);
    //   res.send(result);
    // })
    const { ObjectId } = require('mongodb');

    // Get connections for a user
    app.get('/connection', async (req, res) => {
      if (email) query.requesterEmail = email;
      const query = {};
      if (email) query.email = email; // make sure 'email' matches your DB field

      try {
        const result = await connectionCollection.find(query).toArray();
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Failed to load connections' });
      }
    });

    // Add a new connection request
    app.post('/connection', async (req, res) => {
      const newConnection = req.body;
      try {
        const result = await connectionCollection.insertOne(newConnection);
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Failed to create connection' });
      }
    });

    // Update connection message
    app.patch('/connection/:id', async (req, res) => {
      const id = req.params.id;
      const { message } = req.body;
      try {
        const result = await connectionCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { message } }
        );
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Failed to update connection' });
      }
    });

    // Delete a connection
    app.delete('/connection/:id', async (req, res) => {
      const id = req.params.id;
      try {
        const result = await connectionCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Failed to delete connection' });
      }
    });



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  finally {

  }
}

run().catch(console.dir)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})