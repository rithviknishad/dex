// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Scene } from "@/types/scene";
import { Refer } from "@/types/types";
import { ScenesManager } from "@/utils/mongoAdapters";
import type { NextApiRequest, NextApiResponse } from "next";

type ErrorResponse = {
  detail: string;
};

type OKResponse = {
  id: Refer<Scene>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | Scene | OKResponse>
) {
  const { sceneId } = req.query;

  if (!sceneId) {
    res.status(400).json({ detail: "sceneId is required" });
    return;
  }

  if (Array.isArray(sceneId)) {
    res.status(400).json({ detail: "sceneId must be a string" });
    return;
  }

  if (req.method === "GET") {
    return await ScenesManager.retrieve(sceneId)
      .then((scene) => {
        if (!scene) {
          res.status(404).json({ detail: "Not found" });
          return;
        }
        res.status(200).json(scene);
      })
      .catch((err) => res.status(500).json({ detail: err.message }));
  }

  if (req.method === "PUT") {
    return await ScenesManager.update(sceneId, req.body)
      .then((id) => {
        if (!id) {
          res.status(404).json({ detail: "Not found" });
          return;
        }
        res.status(200).json({ id });
      })
      .catch((err) => res.status(500).json({ detail: err.message }));
  }

  if (req.method === "DELETE") {
    return await ScenesManager.delete(sceneId)
      .then((deleted) => {
        if (!deleted) {
          res.status(404).json({ detail: "Not found" });
          return;
        }
        res.status(200).json({ id: sceneId });
      })
      .catch((err) => res.status(500).json({ detail: err.message }));
  }
}
