import mongoose from "mongoose";

export default async function handler(req, res) {
  const { MONGODB_URI } = process.env;
  const { sceneId } = req.query;

  if (!MONGODB_URI) {
    res.status(500).json({ detail: "MONGO_URL not set" });
    return;
  }

  const connection = await mongoose
    .connect(MONGODB_URI)
    .catch((err) => res.status(500).json({ detail: err.message }));

  if (!connection) {
    return;
  }

  const collection = connection.connection.db.collection("scenes");
  const _id = new mongoose.Types.ObjectId(sceneId);

  if (req.method === "GET") {
    const scene = await collection.findOne({ _id });

    if (!scene) {
      res.status(404).json({ detail: "Not found" });
      return;
    }

    res.status(200).json({ id: scene._id.toString(), scene });
    return;
  }

  if (req.method === "PUT") {
    const scene = req.body;

    const now = new Date().toISOString();

    const result = await collection.updateOne(
      { _id },
      { $set: { ...scene, updated_at: now } }
    );

    if (result.modifiedCount === 0) {
      res.status(404).json({ detail: "Not found" });
      return;
    }

    res.status(200).json({ id: sceneId });
    return;
  }

  if (req.method === "DELETE") {
    const result = await collection.deleteOne({ _id });

    if (result.deletedCount === 0) {
      res.status(404).json({ detail: "Not found" });
      return;
    }

    res.status(200).json({ id: sceneId });
    return;
  }
}
