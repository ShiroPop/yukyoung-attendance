// src/utils/firestore.ts
import { db } from "../firebase";
import { collection, getDocs, query, QueryConstraint } from "firebase/firestore";

export async function fetchCollection(
  pathSegments: [string, ...string[]],
  constraints: QueryConstraint[] = []
): Promise<any[]> {
  try {
    const ref = collection(db, ...pathSegments);
    const q = constraints.length > 0 ? query(ref, ...constraints) : ref;
    const snapshot = await getDocs(q);

    const result: any[] = [];
    snapshot.forEach((doc) => result.push({ id: doc.id, ...doc.data() }));

    return result;
  } catch (error) {
    console.error(`Firestore 에러 [${pathSegments.join("/")}]`, error);
    return [];
  }
}
