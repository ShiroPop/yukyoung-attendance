import { initializeApp, getApps } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { firebaseDevConfig, firebaseProdConfig } from "./firebaseConfig";

// 각각의 Firebase App 초기화
const prodApp = getApps().find((app) => app.name === "prod") ?? initializeApp(firebaseProdConfig, "prod");

const devApp = getApps().find((app) => app.name === "dev") ?? initializeApp(firebaseDevConfig, "dev");

// 자동으로 Firestore 인스턴스를 도메인에 따라 가져오는 함수
export function getFirestoreByHost(): Firestore {
  const host = window.location.hostname;

  if (
    host === "school-attendance-test.firebaseapp.com" ||
    host === "school-attendance-test.web.app" ||
    host === "localhost"
  ) {
    return getFirestore(devApp);
  }

  if (host === "yukyoung-attendance-ac519.firebaseapp.com" || host === "yukyoung-attendance-ac519.web.app") {
    return getFirestore(prodApp);
  }

  // fallback (로컬 포함)
  return getFirestore(devApp);
}
