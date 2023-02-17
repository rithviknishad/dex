import mongoose from "mongoose";

export default async function handler(
  req, res
) {
  const { MONGO_URL } = process.env;

  if (!MONGO_URL) {
    res.status(500).json({ detail: "MONGO_URL not set" });
    return;
  }

  const connection = await mongoose
    .connect(MONGO_URL)
    .catch((err) => res.status(500).json({ detail: err.message }));

  if (!connection) {
    return;
  }

  const collection = connection.connection.db.collection("scenes");

  if (req.method === "GET") {
    const scenes = await collection.find().toArray();
    const results = Object.fromEntries(
      scenes.map((scene) => [scene._id.toString(), scene ])
    );

    res.status(200).json({ results });
    return;
  }

  if (req.method === "POST") {
    const scene = req.body ;

    // TODO: validate
    // if (!data. || !description || !image || !url) {
    //   res.status(400).json({ detail: "Missing fields" });
    //   return;
    // }

    const now = new Date().toISOString();

    const result = await collection.insertOne({
      ...scene,
      created_at: now,
      updated_at: now,
    });

    res.status(200).json({ id: result.insertedId.toString() });
    return;
  }
}
