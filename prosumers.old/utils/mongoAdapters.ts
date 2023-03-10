import { Scene } from "@/types/scene";
import { Refer } from "@/types/types";
import mongoose from "mongoose";

function initializeMongooseConnection() {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI not set");
  }

  return mongoose.connect(MONGODB_URI);
}

function collection(connection: typeof mongoose, name: string) {
  return connection.connection.db.collection(name);
}

function toObjectId(id: string) {
  return new mongoose.Types.ObjectId(id);
}

export const ScenesManager = {
  async list() {
    const mongoose = await initializeMongooseConnection();
    const res = await collection(mongoose, "scenes").find().toArray();
    return Object.fromEntries(res.map((s) => [s._id.toString(), s as any]));
  },

  async create(scene: Scene): Promise<Refer<Scene>> {
    const mongoose = await initializeMongooseConnection();
    const now = new Date().toISOString();
    const result = await collection(mongoose, "scenes").insertOne({
      ...scene,
      created_at: now,
      updated_at: now,
    });
    return result.insertedId.toString();
  },

  async retrieve(sceneId: Refer<Scene>): Promise<Scene | null> {
    const mongoose = await initializeMongooseConnection();
    const res = await collection(mongoose, "scenes").findOne({
      _id: toObjectId(sceneId),
    });
    return res as any;
  },

  async update(
    sceneId: Refer<Scene>,
    scene: Scene
  ): Promise<Refer<Scene> | null> {
    const mongoose = await initializeMongooseConnection();
    const now = new Date().toISOString();
    const result = await collection(mongoose, "scenes").updateOne(
      { _id: toObjectId(sceneId) },
      { $set: { ...scene, updated_at: now } }
    );
    if (result.modifiedCount === 0) {
      return null;
    }
    return sceneId;
  },

  async delete(sceneId: Refer<Scene>): Promise<boolean> {
    const mongoose = await initializeMongooseConnection();
    const result = await collection(mongoose, "scenes").deleteOne({
      _id: toObjectId(sceneId),
    });
    return result.deletedCount === 1;
  },
};
