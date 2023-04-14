export * as JWTAuth from "./JWTAuth";

export type Paginated<T> = {
  count: number;
  previous: string;
  next: string;
  results: readonly T[];
};

export type Model<T extends object> = T & {
  created_on: string;
  updated_on: string;
  id: ModelPK;
};

export declare type ModelPK = string | number;
