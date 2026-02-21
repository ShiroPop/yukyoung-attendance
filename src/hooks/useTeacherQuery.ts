import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firestore";

interface Teacher {
  id: string;
  role: string;
  assigned_classes: string[];
}

export const useTeachersQuery = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const q = query(collection(db, "user"), where("role", "!=", "admin"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        role: doc.data().role,
        assigned_classes: doc.data().assigned_classes ?? [],
      })) as Teacher[];
    },
  });
};

export const useTeacherDetailQuery = (teacherId: string) => {
  return useQuery({
    queryKey: ["teacher", teacherId],
    queryFn: async () => {
      const q = query(collection(db, "user"), where("role", "!=", "admin"));
      const snapshot = await getDocs(q);
      const doc = snapshot.docs.find((d) => d.id === teacherId);
      if (!doc) return null;
      return {
        id: doc.id,
        role: doc.data().role,
        assigned_classes: doc.data().assigned_classes ?? [],
      } as Teacher;
    },
    enabled: !!teacherId,
  });
};
