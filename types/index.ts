import { Stock } from "models/Stock";

export type VotesType = {
  count: number;
  value: number;
}

export type PunctuationType = {
  countOpinions: number;
  punctuation: number;
  votes: VotesType[]
}

export type ReviewType = {
  name: string;
  avatar: string;
  description: string;
  punctuation: number;
}

export type ProductType = {
  _id: string;
  id: string;
  name: string;
  thumb: string;
  price: string;
  description: string;
  count: number;
  color: string;
  size: Stock[];
  images: string[];
  discount?: string;
  currentPrice: number;
  punctuation: PunctuationType;
  reviews: ReviewType[];
}

export type ProductTypeList = {
  id: string;
  name: string;
  price: string;
  //color: string;
  images: string[];
  discount?: string;
  currentPrice?: number;
}

export type ProductStoreType = {
  id: string;
  name: string;
  thumb: string;
  price: number;
  count: number;
  stock: string;
  size: string;
}

export type GtagEventType = {
  action: string;
  category: string; 
  label: string;
  value: string
}