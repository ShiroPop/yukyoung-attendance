import { initializeApp, getApps } from "firebase/app";
import { firebaseDevConfig, firebaseProdConfig } from "./firebaseConfig";

const prodApp = getApps().find((app) => app.name === "prod") ?? initializeApp(firebaseProdConfig, "prod");

const devApp = getApps().find((app) => app.name === "dev") ?? initializeApp(firebaseDevConfig, "dev");

export { prodApp, devApp };
