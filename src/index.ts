import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import router from "./routes";
import sequelize from "./config/dbConnection";

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
        status: "NO DATA"
    })
})

app.use('/api', router);

const doc = {
    info: {
        title: 'omni-api',
        description: '',
    },
    host: 'localhost:5000',
    schemes: ['http'],
};

const outputFile = './swagger/swagger.json';
const endpointsFiles = ['./index.ts'];

/* NOTE: if you use the express Router, you must pass in the 
    'endpointsFiles' only the root file where the route starts,
    such as index.js, app.js, routes.js, ... */

// Start the server
async function initialise() {
    try {
        await sequelize.authenticate();

        // await swaggerAutogen(outputFile, endpointsFiles, doc);

        /* // let express to use this
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(doc)); */

        app.listen(port, () => {
            console.log(`Listening on: ${port}`)
        });
    } catch (error) {
        console.log(`Unable to connect to the database: ${JSON.stringify(error)}`);
    }
}

initialise();