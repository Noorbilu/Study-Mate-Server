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
    try{
        await client.connect();

         
        const db = client.db('study_mate');
        const mateCollection = db.collection('mates');


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

        app.get('/mates/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await mateCollection.findOne(query);
            res.send(result);
        })


        app.post('/mates', async(req ,res) => {
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

        app.delete('/mates/:id', async(req ,res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await mateCollection.deleteOne(query);
            res.send(result);
        })
        

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally{

    } 
  } 

run().catch(console.dir)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})