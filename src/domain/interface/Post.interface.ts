//interface/post.interface.ts

import { Asset } from "react-native-image-picker";
import { Property, Type } from "../enum/post";

export interface PostData {
  title: string;
  price: string;
  address: string;
  desc: string;
  city: string;
  bedroom: string;
  bathroom: string;
  latitude: number | null;
  longitude: number | null;
  type: keyof typeof Type;
  property: keyof typeof Property;
  images: Asset[]; // *** Nouveau: Tableau pour stocker les URIs des images ***
  id?: string;
  [key: string]: any; // pour permettre d'autres propriétés dynamiques
}