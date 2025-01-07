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
import serverless from 'serverless-http';
const cors: any = require("cors");
import queueMail from './middleware/queueMail';

const app = express();

// Middleware
app.use(cors({ origin: "*" })); // Enable CORS
app.use(express.json()); // JSON middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(queueMail);

// Database initialization
dbInit();

// Serve static files (frontend)
let uiCodePath = "dist"; // Make sure this points to the folder where your `index.html` is located after build
app.use(express.static(path.join(__dirname, '..', uiCodePath)));

// Serve the frontend for the root route
app.get("/", async (req: Request, res: Response) => {
  return res.sendFile(
    path.join(__dirname, "..", uiCodePath, "index.html")
  );
});

// API routes
app.use('/api/v1', routes);

app.use('/api/v1/protected', (req: Request, res: Response) => {
  res.send({ message: 'This is a protected route' });
});

// Handle all other routes and serve the frontend
app.get("*", async (req: Request, res: Response) => {
  return res.sendFile(
    path.join(__dirname, "..", uiCodePath, "index.html")
  );
});

// Export the handler for serverless (Vercel)
module.exports.handler = serverless(app);

// Success message (will appear in logs)
console.log("Backend successfully deployed and running!");
