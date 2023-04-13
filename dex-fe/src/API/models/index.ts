export * as JWTAuth from "./JWTAuth";

export declare type Paginated<T> = {
  count: number;
  previous: string;
  next: string;
  results: readonly T[];
};

export declare type Model<T> = T & {
  created_on: string;
  updated_on: string;
  id: ModelPK;
};

export declare type ModelPK = string | number;
