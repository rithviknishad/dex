// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Scene } from "@/types/scene";
import { Collection, Refer } from "@/types/types";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

type ErrorResponse = {
  detail: string;
};

type CreatedResponse = {
  id: Refer<Scene>;
};

type ListResponse = {
  results: Collection<Scene>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | CreatedResponse | ListResponse>
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

  const scenes = await connection.connection.db.collection("scenes");

  if (req.method === "GET") {
    const scenes = await connection.connection.db
      .collection("scenes")
      .find()
      .toArray();

    const results = Object.fromEntries(
      scenes.map((scene) => [scene._id.toString(), scene as any])
    );

    res.status(200).json({ results });
    return;
  }

  if (req.method === "POST") {
    const scene = req.body as Scene;

    // TODO: validate
    // if (!data. || !description || !image || !url) {
    //   res.status(400).json({ detail: "Missing fields" });
    //   return;
    // }

    const now = new Date().toISOString();

    const result = await scenes.insertOne({
      ...scene,
      createdAt: now,
      updatedAt: now,
    });

    res.status(200).json({ id: result.insertedId.toString() });
    return;
  }
}
