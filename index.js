const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3c2xoyj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const movieCollections = client.db('movieDB').collection('movies');
        const upcommingMovieCollections = client.db('movieDB').collection('upcomingMovie');

        app.get('/movies', async (req, res) => {
            const result = await movieCollections.find().sort({ entryDate: -1 }).toArray();
            res.send(result);
        })

        app.get('/movies/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await movieCollections.findOne(filter);
            res.send(result);
        })

        app.get('/upcomingMovies', async (req, res) => {
            const result = await upcommingMovieCollections.find().toArray();
            res.send(result);
        })

        app.get('/mymovies', async (req, res) => {
            // console.log(req.query.email);
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await movieCollections.find(query).sort({ entryDate: -1 }).toArray();
            res.send(result)
        })

        app.get('/mymovies/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await movieCollections.findOne(filter);
            res.send(result);
        })

        app.patch('/mymovies/:id', async (req, res) => {
            const id = req.params.id;
            const movie = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateMovie = {
                $set: {
                    ...movie
                }
            }
            const result = await movieCollections.updateOne(filter, updateMovie);
            res.send(result);
            console.log(result);
        })

        app.post('/movies', async (req, res) => {
            const movie = req.body;
            movie.entryDate = new Date();
            const result = await movieCollections.insertOne(movie);
            res.send(result);
        })

        app.delete('/movies/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await movieCollections.deleteOne(filter);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Movie Server Running')
})

app.listen(port, () => {
    console.log(`Movie Server is Ruuning Port ${5000}`);
})