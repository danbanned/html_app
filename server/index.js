import express from "express";
import chatRouter from "./chatRouter.js";
import cors from "cors";
import dotenv from "dotenv";


//express → web server framework

//node-fetch → allows making HTTP requests (to OpenAI API)

//dotenv → loads your API key securely from .env

//cors → allows your frontend (React app) to talk to the backend
dotenv.config();

const app = express();
// Enable Cross-Origin Resource Sharing 
// (so frontend on a different port can call backend)
app.use(cors());

// Parse incoming JSON request bodies automatically
app.use(express.json());

// Mount the chat router (all /api/chat requests go here)
app.use("/", chatRouter);

// Define server port and start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


//app.use(express.json());
//app.use(chatRouter);
//app.listen(process.env.PORT || 3000);
