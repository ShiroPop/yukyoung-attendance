// src/utils/firestore.ts
import { db } from "../firebase";
import { collection, getDocs, query, where, QueryConstraint, addDoc, setDoc, doc } from "firebase/firestore";

export async function fetchCollection(collectionName: string, constraints: QueryConstraint[] = []): Promise<any[]> {
  try {
    const ref = collection(db, collectionName);
    const q = constraints.length > 0 ? query(ref, ...constraints) : ref;
    const snapshot = await getDocs(q);

    const result: any[] = [];
    snapshot.forEach((doc) => result.push({ id: doc.id, ...doc.data() }));

    return result;
  } catch (error) {
    console.error(`Firestore 에러 [${collectionName}]:`, error);
    return [];
  }
}

export async function addDocument(collectionName: string, data: any, docId?: string): Promise<string> {
  try {
    if (docId) {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, data);
      return docRef.id;
    } else {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    }
  } catch (error) {
    console.error(`Error writing document to "${collectionName}"`, error);
    throw error;
  }
}
