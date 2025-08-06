import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { prodDb, devDb } from "../firestore";

interface LogData {
  action: "create" | "update" | "delete";
  collection: string;
  documentId: string;
  data?: any; // 선택적으로 로그에 포함할 실제 데이터
  performedBy: string;
}

const db = process.env.NODE_ENV === "production" ? prodDb : devDb;

export const logAction = async ({ action, collection, documentId, data, performedBy }: LogData) => {
  const logRef = doc(db, "action_logs", `${Date.now()}_${collection}_${documentId}`);

  await setDoc(logRef, {
    action,
    collection,
    documentId,
    data: data ?? null,
    timestamp: serverTimestamp(),
    performedBy: performedBy,
  });
};

// 사용 예시

// const userRef = doc(db, "user", userId);
// const userSnap = await getDoc(userRef);

// // 삭제 전 데이터 확보
// const userData = userSnap.exists() ? userSnap.data() : null;

// // 로그 저장
// await logAction({
//   action: "delete",
//   collection: "user",
//   documentId: userId,
//   data: userData,
// });

// // 실제 삭제
// await deleteDoc(userRef);

// export const createUserWithLog = async (userId: string, userData: any) => {
//   const userRef = doc(db, "user", userId);

//   // 데이터 저장
//   await setDoc(userRef, userData);

//   // 로그 기록
//   await logAction({
//     action: "create",
//     collection: "user",
//     documentId: userId,
//     data: userData,
//   });
// };
