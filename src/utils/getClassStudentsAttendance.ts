import { useAttendanceDatesStore } from "../store/attendanceDatesStore";
import { useStudentsStore } from "../store/studentsStore";
import { fetchCollection } from "./firestore";

export type Student = {
  id: string;
  name: string;
  classId: string;
  state?: number;
};

type WeeklyAttendanceSummary = {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
};

type StudentAttendanceInfo = Student & WeeklyAttendanceSummary;

function getWeekdayName(dateString: string): keyof WeeklyAttendanceSummary | null {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;

  const day = date.getDay(); // 0(Sun) ~ 6(Sat)

  switch (day) {
    case 1:
      return "monday";
    case 2:
      return "tuesday";
    case 3:
      return "wednesday";
    case 4:
      return "thursday";
    case 5:
      return "friday";
    default:
      return null; // 주말은 무시
  }
}

export async function getClassStudentsAttendance(
  semesterId: string,
  classId: string
): Promise<StudentAttendanceInfo[]> {
  const { setStudents } = useStudentsStore.getState();
  const { setAttendanceDates } = useAttendanceDatesStore.getState();

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
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
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
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
      });
      allStudents.push(student);
    });
  }

  setStudents(allStudents);

  // 2. 출석 날짜들 가져오기
  const attendanceDates = await fetchCollection(["semester", semesterId, "attendance"]);
  setAttendanceDates(attendanceDates);

  // 3. 날짜별 출석 데이터 처리
  for (const date of attendanceDates) {
    const dateId = date.id;
    const weekday = getWeekdayName(dateId);
    if (!weekday) continue; // 주말 제외

    const attendanceList = await fetchCollection(["semester", semesterId, "attendance", dateId, "student_attendance"]);

    attendanceList.forEach((record) => {
      const studentId = record.id;
      const state = record.state;

      const student = studentMap.get(studentId);
      if (!student) return;

      if (state === 0) {
        student[weekday] += 1;
      }
    });
  }

  console.log(attendanceDates);
  return Array.from(studentMap.values());
}
