import { getFirestore } from "firebase/firestore";
import { prodApp, devApp } from "./firebase";

export const prodDb = getFirestore(prodApp);
export const devDb = getFirestore(devApp);
