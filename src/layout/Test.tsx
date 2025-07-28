import { useEffect, useState } from "react";
import { addDocument, fetchCollection } from "../utils/firestore";
import { useForm } from "react-hook-form";

type Student = {
  id: string;
  name: string;
  classId: string;
};

type AttendanceSummary = {
  attendCount: number;
  absentCount: number;
  total: number;
};

type StudentAttendanceInfo = Student & AttendanceSummary;

const Test = () => {
  const [semester, setSemester] = useState<any>();
  const [classes, setClasses] = useState<any>();
  const [student, setStudent] = useState<any>();

  // useEffect(() => {
  //   fetchCollection("semester").then((data) => {
  //     setSemester(data);
  //   });
  //   fetchCollection("class").then((data) => {
  //     setClasses(data);
  //   });
  // }, []);

  // const handleAddClass = async () => {
  //   const newData = {
  //     start_date: new Date(),
  //     end_date: new Date(),
  //   };

  //   const docId = await addDocument("semester", newData);
  //   console.log("추가된 문서 ID:", docId);
  // };

  // const { handleSubmit, register } = useForm<Inputs>();

  const getClassStudentsAttendance = async (semesterId: string, classId: string) => {
    // 1. 학생 목록 가져오기
    const students = await fetchCollection(["semester", semesterId, "class", classId, "student"]);

    const studentMap = new Map<string, StudentAttendanceInfo>();

    students.forEach((stu) => {
      studentMap.set(stu.id, {
        id: stu.id,
        name: stu.name,
        classId: stu.class || classId,
        attendCount: 0,
        absentCount: 0,
        total: 0,
      });
    });

    // 2. 출석 날짜들 가져오기
    const attendanceDates = await fetchCollection(["semester", semesterId, "attendance"]);

    // 3. 날짜별 출석 서브컬렉션 처리
    for (const date of attendanceDates) {
      const dateId = date.id; // YYYY-MM-DD

      const attendanceList = await fetchCollection([
        "semester",
        semesterId,
        "attendance",
        dateId,
        "student_attendance",
      ]);

      attendanceList.forEach((record) => {
        const studentId = record.id;
        const state = record.state; // 0 or 1

        const student = studentMap.get(studentId);
        if (!student) return; // 해당 반 학생이 아닐 수 있음

        if (state === 0) student.attendCount += 1;
        else if (state === 1) student.absentCount += 1;

        student.total = student.attendCount + student.absentCount;
      });
    }

    return Array.from(studentMap.values());
  };

  return (
    <>
      {/* <form onSubmit={handleSubmit(handleAttendance)}>
        {semester?.map((ele: any) => (
          <select {...register("semester")} key={ele.id}>
            <option value={ele.id}>{ele.start_date.toDate().toLocaleDateString()}</option>
          </select>
        ))}
        {classes?.map((ele: any) => (
          <label key={ele.id} id="class">
            <input {...register("class")} type="radio" name="class" value={ele.id} />
            {ele.name}
          </label>
        ))}
        <button type="submit">출석</button>
      </form> */}
    </>
  );
};

export default Test;
