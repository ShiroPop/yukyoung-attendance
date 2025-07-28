import { useAttendanceDatesStore } from "../store/attendanceDatesStore";
import { useStudentsStore } from "../store/studentsStore";
import { fetchCollection } from "./firestore";

export type Student = {
  id: string;
  name: string;
  classId: string;
  state?: number;
};

type AttendanceSummary = {
  attendCount: number;
  absentCount: number;
  total: number;
};

type StudentAttendanceInfo = Student & AttendanceSummary;

export async function getClassStudentsAttendance(
  semesterId: string,
  classId: string
): Promise<StudentAttendanceInfo[]> {
  const { setStudents } = useStudentsStore.getState();
  const { setDates } = useAttendanceDatesStore.getState();

  const studentMap = new Map<string, StudentAttendanceInfo>();

  const allStudents: Student[] = [];

  // 1. 학생 목록 가져오기
  if (classId === "전체") {
    const classes = await fetchCollection(["semester", semesterId, "class"]);

    for (const cls of classes) {
      const classKey = cls.id;
      const students = await fetchCollection(["semester", semesterId, "class", classKey, "student"]);

      students.forEach((stu) => {
        const student = {
          id: stu.id,
          name: stu.name,
          classId: stu.class || classKey,
        };
        studentMap.set(stu.id, {
          ...student,
          attendCount: 0,
          absentCount: 0,
          total: 0,
        });
        allStudents.push(student);
      });
    }
  } else {
    const students = await fetchCollection(["semester", semesterId, "class", classId, "student"]);

    students.forEach((stu) => {
      const student = {
        id: stu.id,
        name: stu.name,
        classId: stu.class || classId,
      };
      studentMap.set(stu.id, {
        ...student,
        attendCount: 0,
        absentCount: 0,
        total: 0,
      });
      allStudents.push(student);
    });
  }

  setStudents(allStudents);

  // 2. 출석 날짜들 가져오기
  const attendanceDates = await fetchCollection(["semester", semesterId, "attendance"]);
  setDates(attendanceDates);

  // 3. 날짜별 출석 서브컬렉션 처리
  for (const date of attendanceDates) {
    const dateId = date.id;

    const attendanceList = await fetchCollection(["semester", semesterId, "attendance", dateId, "student_attendance"]);

    attendanceList.forEach((record) => {
      const studentId = record.id;
      const state = record.state; // 0 or 1

      const student = studentMap.get(studentId);
      if (!student) return;

      if (state === 0) student.attendCount += 1;
      else if (state === 1) student.absentCount += 1;

      student.total = student.attendCount + student.absentCount;
    });
  }

  return Array.from(studentMap.values());
}
