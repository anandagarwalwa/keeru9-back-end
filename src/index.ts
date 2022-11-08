import express from "express";
import cors from "cors";
const { MongoClient } = require('mongodb');
import bodyParser from "body-parser";
import dotenv from "dotenv";
const database = 'keeru9';
import { gameRoutes } from "./routes/gameRoutes";
const url = 'mongodb+srv://manohar:Manohar123@cluster0.sholwmt.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure all apis
app.get('/', (req, res) => {
    
    res.json({
        status: "working"
    })
})

app.get('/about', (req, res) => {
    res.json({
        status: "Here is about api working"
    })
})

app.use('/api/games', gameRoutes);

// Start the server
async function initialise() {
    try {
        await client.connect();
        app.listen(port, () => {
            console.log(`Listening on: ${port}`)
        });
    } catch (error) {
        console.log(`Unable to connect to the database: ${JSON.stringify(error)}`);
    }
}

initialise();