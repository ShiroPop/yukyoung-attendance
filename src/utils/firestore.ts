// src/utils/firestore.ts
import { db } from "../firebase";
import { collection, getDocs, query, QueryConstraint, addDoc, setDoc, doc, serverTimestamp } from "firebase/firestore";

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

export async function addDocument(collectionName: string, data: any, docId?: string): Promise<string> {
  try {
    const newData = {
      ...data,
      createdAt: serverTimestamp(),
      dummy: true,
    };
    if (docId) {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, newData);
      return docRef.id;
    } else {
      const docRef = await addDoc(collection(db, collectionName), newData);
      return docRef.id;
    }
  } catch (error) {
    console.error(`Firestore 에러 [${collectionName}]:`, error);
    throw error;
  }
}
