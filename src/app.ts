// import express, {Request,Response} from 'express';
// import "dotenv/config"
// import path from 'path';
// import routes from './routes';
// import bodyParser from 'body-parser';
// import dbInit from './db/init';
// const cors: any = require("cors"); 
// import serverless from 'serverless-http'
// import queueMail from './middleware/queueMail';


// const app = express();
// const port = process.env.PORT || 5000;
// 	app.use(cors({
// 		origin:"*"	})); // enable cors
// 	// Body parsing Middleware
// 	app.use(express.json()); // josn middle ware
// 	app.use(bodyParser.json());
// 	app.use(bodyParser.urlencoded({ extended: true }));
// 	//app.use(queueMail);
// 	app.use(queueMail);




// // // database initialization
// dbInit();

// //let uiCodePath = process.env.NODE_ENV == "development"? "client/dist" : "client-dist";
// let uiCodePath = "client-dist"; //use this to debug production code 
// app.use(express.static(path.join(__dirname, '..', uiCodePath)));

// app.get("/", async (req: Request, res: Response) => {
// 	return res.sendFile(
// 		path.join(__dirname, "..", uiCodePath, "index.html")
// 	);
// });

// //Intialising routes 
// app.use('/api/v1', routes)


// app.use('/api/v1/protected', (req: Request, res: Response) => {
//     res.send({ message: 'This is a routes route' });
// });



// app.get("*", async (req: Request, res: Response) => {
// 	return res.sendFile(
// 		path.join(__dirname, "..", uiCodePath, "index.html")
// 	);
// });



// app.listen(5000, () => {
//   return console.log(`Express is listening at http://localhost:${port}`);
// });

// const handler = serverless(app)

// module.exports.handler = handler;

import express, { Request, Response } from 'express';
import "dotenv/config";
import path from 'path';
import routes from './routes';
import bodyParser from 'body-parser';
import dbInit from './db/init';
import cors from 'cors';
import serverless from 'serverless-http';
import queueMail from './middleware/queueMail';

const app = express();
const port = process.env.PORT || 5000;

// CORS Configuration for Production
const allowedOrigins = [
    "http://localhost:5173",  // Development Frontend URL
    "https://tms-backed-prod.vercel.app"  // Production Frontend URL
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log(`Blocked by CORS: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle Preflight Requests (OPTIONS)
app.options('*', (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});

// Body Parsing Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(queueMail);  // QueueMail middleware

// Database Initialization
dbInit();

// Serve the UI files from production build (client-dist folder)
const uiCodePath = "client-dist";
app.use(express.static(path.join(__dirname, '..', uiCodePath)));

// Serve the main index.html for the frontend
app.get("/", async (req: Request, res: Response) => {
    return res.sendFile(path.join(__dirname, "..", uiCodePath, "index.html"));
});

// Initialize API Routes
app.use('/api/v1', routes);

// Example Protected Route
app.use('/api/v1/protected', (req: Request, res: Response) => {
    res.send({ message: 'This is a protected route' });
});

// Catch-all for Other Routes
app.get("*", async (req: Request, res: Response) => {
    return res.sendFile(path.join(__dirname, "..", uiCodePath, "index.html"));
});

// Start the Server in Development Mode
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

// Serverless Deployment for Production (AWS Lambda, Vercel)
const handler = serverless(app);
module.exports.handler = handler;
