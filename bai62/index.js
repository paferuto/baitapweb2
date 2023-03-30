const express = require("express");
const app = express();
const port = 4000;
const morgan = require("morgan");
app.use(morgan("combined"));
const bodyParser = require("body-parser");
app.use(bodyParser.json());


// app.use(bodyParser.urlencoded({ extended: true }));
const cors = require("cors");
app.use(cors());
app.listen(port, () => {
  console.log(`My Server listening on port ${port}`);
});
app.get("/", (req, res) => {
  res.send("This Web server is processed for MongoDB");
});
const { MongoClient, ObjectId } = require("mongodb");
client = new MongoClient("mongodb://127.0.0.1:27017");
client.connect();
database = client.db("FashionData2");
fashionCollection = database.collection("Fashion");


app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb" }));
app.use(express.json());

app.get("/fashions", cors(), async (req, res) => {
  try {
    const result = await fashionCollection
      .find({})
      .sort({ created_date: -1 })
      .toArray();
    res.send(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/fashions/:id", cors(), async (req, res) => {
  var o_id = new ObjectId(req.params["id"]);
  const result = await fashionCollection.find({ _id: o_id }).toArray();
  res.send(result[0]);
});

// Get fashion by style
app.get("/styles", async (req, res) => {
  try {
    let s = req.query.style;
    const response = await fashionCollection.find({ style: s }).toArray();
    res.send(response);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/fashions", cors(), async (req, res) => {
  //put json Fashion into database
  await fashionCollection.insertOne(req.body);
  //send message to client(send all database to client)
  res.send(req.body);
});

app.put("/fashions", cors(), async (req, res) => {
  //update json Fashion into database
  await fashionCollection.updateOne(
    { _id: new ObjectId(req.body._id) }, //condition for update
    {
      $set: {
        //Field for updating
        style: req.body.style,
        detail: req.body.detail,
        thumbnail: req.body.thumbnail,
        title: req.body.title,
      },
    }
  );
  //send Fashion after updating
  var o_id = new ObjectId(req.body._id);
  const result = await fashionCollection.find({ _id: o_id }).toArray();
  res.send(result[0]);
});

app.delete("/fashions/:id", cors(), async (req, res) => {
  //find detail Fashion with id
  var o_id = new ObjectId(req.params["id"]);
  const result = await fashionCollection.find({ _id: o_id }).toArray();
  //update json Fashion into database
  await fashionCollection.deleteOne({ _id: o_id });
  //send Fahsion after remove
  res.send(result[0]);
});
