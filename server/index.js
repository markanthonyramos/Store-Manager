require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const items = require("./routes/items");
const logs = require("./routes/logs");

const path = require("path");
app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "build"));
});

app.use(cors());
app.use(express.json());

// Routes
app.use(items);
app.use(logs);

app.listen(process.env.PORT);