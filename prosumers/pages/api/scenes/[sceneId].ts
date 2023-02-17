// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Scene } from "@/types/scene";
import { Refer } from "@/types/types";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

type ErrorResponse = {
  detail: string;
};

type RetrieveResponse = {
  id: Refer<Scene>;
  scene: Scene;
};
type OKResponse = {
  id: Refer<Scene>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | RetrieveResponse | OKResponse>
) {
  const { MONGO_URL } = process.env;
  const { sceneId } = req.query;

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
  const _id = new mongoose.Types.ObjectId(sceneId as string);

  if (req.method === "GET") {
    const scene = await collection.findOne({ _id });

    if (!scene) {
      res.status(404).json({ detail: "Not found" });
      return;
    }

    res.status(200).json({
      id: scene._id.toString(),
      scene: scene as any,
    });
    return;
  }

  if (req.method === "PUT") {
    const scene = req.body as Scene;

    const now = new Date().toISOString();

    const result = await collection.updateOne(
      { _id },
      { $set: { ...scene, updated_at: now } }
    );

    if (result.modifiedCount === 0) {
      res.status(404).json({ detail: "Not found" });
      return;
    }

    res.status(200).json({ id: sceneId as string });
    return;
  }

  if (req.method === "DELETE") {
    const result = await collection.deleteOne({ _id });

    if (result.deletedCount === 0) {
      res.status(404).json({ detail: "Not found" });
      return;
    }

    res.status(200).json({ id: sceneId as string });
    return;
  }
}
