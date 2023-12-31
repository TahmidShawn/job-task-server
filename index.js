const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.azrqgfm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  const userCollection = client.db("quivDB").collection("users");
  const taskCollection = client.db("quivDB").collection("task");

  app.post("/users", async (req, res) => {
    const item = req.body;
    const result = await userCollection.insertOne(item);
    res.send(result);
  });

  app.get("/users", async (req, res) => {
    const result = await userCollection.find().toArray();
    res.send(result);
  });

  app.get("/task", async (req, res) => {
    const result = await taskCollection.find().toArray();
    res.send(result);
  });

  app.get("/task/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await taskCollection.findOne(query);
    res.send(result);
  });

  app.delete("/task/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await taskCollection.deleteOne(query);
    res.send(result);
  });

  app.put("/task/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const task = req.body;

    const updateJob = {
      $set: {
        title: task.title,
        priority: task.priority,
        description: task.description,
        deadline: task.deadline,
        time: task.time,  
      },
    };

    const result = await taskCollection.updateOne(filter, updateJob, options);
    res.send(result);
  });

  app.post("/task", async (req, res) => {
    const item = req.body;
    const result = await taskCollection.insertOne(item);
    res.send(result);
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`QuivVY server running on port ${port}`);
});
