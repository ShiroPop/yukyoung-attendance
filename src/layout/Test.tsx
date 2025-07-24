import { useEffect, useState } from "react";
import { addDocument, fetchCollection } from "../utils/firestore";
import { SubmitHandler, useForm } from "react-hook-form";

interface Inputs {
  semester: string;
  class: string;
}

const Test = () => {
  const [semester, setSemester] = useState<any>();
  const [classes, setClasses] = useState<any>();

  useEffect(() => {
    fetchCollection("semester").then((data) => {
      setSemester(data);
    });
    fetchCollection("class").then((data) => {
      setClasses(data);
    });
  }, []);

  const handleAddClass = async () => {
    const newData = {
      start_date: new Date(),
      end_date: new Date(),
    };

    const docId = await addDocument("semester", newData);
    console.log("추가된 문서 ID:", docId);
  };

  const { handleSubmit, register } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const handleAttendance = async (data: Inputs) => {
    const docId = data.semester + data.class + new Date().toLocaleDateString();
    await addDocument(
      "attendance",
      {
        semester_id: data.semester,
        student_id: data.class,
        date: new Date(),
        status: "출석",
      },
      docId
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleAttendance)}>
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
      </form>
    </>
  );
};

export default Test;
