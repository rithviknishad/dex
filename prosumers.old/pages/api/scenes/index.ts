import { Scene } from "@/types/scene";
import { Collection, Refer } from "@/types/types";
import { ScenesManager } from "@/utils/mongoAdapters";
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
  if (req.method === "GET") {
    return await ScenesManager.list()
      .then((results) => res.status(200).json({ results }))
      .catch((err) => res.status(500).json({ detail: err.message }));
  }

  if (req.method === "POST") {
    return await ScenesManager.create(req.body)
      .then((id) => res.status(200).json({ id }))
      .catch((err) => res.status(500).json({ detail: err.message }));
  }

  res.status(405).json({ detail: "Method not allowed" });
}
