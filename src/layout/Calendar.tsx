import { useEffect, useState } from "react";
import { fetchCollection } from "../utils/firestore";

const Calendar = () => {
  const [classes, setClasses] = useState<any>();

  useEffect(() => {
    fetchCollection("class").then((data) => {
      setClasses(data);
    });
  }, []);

  console.log(classes);

  return <>{classes !== undefined && <div>dd</div>}</>;
};

export default Calendar;
