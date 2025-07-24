import { useEffect, useState } from "react";
import { fetchCollection } from "../utils/firestore";

interface date {
  day: number;
  currentMonth: boolean;
}

const Calendar = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [dateArray, setDateArray] = useState<Array<Array<date>>>([]);

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  useEffect(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    const prevMonthDates = Array.from({ length: firstDay }, (_, i) => ({
      day: daysInPreviousMonth - firstDay + i + 1,
      currentMonth: false,
    }));

    const currentMonthDates = Array.from({ length: daysInCurrentMonth }, (_, i) => ({
      day: i + 1,
      currentMonth: true,
    }));

    const allDates = [...prevMonthDates, ...currentMonthDates];

    const nextDaysCount = (7 - (allDates.length % 7)) % 7;
    const nextMonthDates = Array.from({ length: nextDaysCount }, (_, i) => ({
      day: i + 1,
      currentMonth: false,
    }));

    const fullDates = [...allDates, ...nextMonthDates];

    const weeks = [];
    for (let i = 0; i < fullDates.length; i += 7) {
      weeks.push(fullDates.slice(i, i + 7));
    }

    setDateArray(weeks);
  }, [month, year]);

  const handleMonth = (next: boolean) => {
    if (next) {
      if (month === 11) {
        setMonth(0);
        setYear((prev) => prev + 1);
      } else {
        setMonth((prev) => prev + 1);
      }
    } else {
      if (month === 0) {
        setMonth(11);
        setYear((prev) => prev - 1);
      } else {
        setMonth((prev) => prev - 1);
      }
    }
  };

  return (
    <>
      <div onClick={() => handleMonth(false)}>pre</div>
      <div>{year}년</div>
      <div>{month + 1}월</div>
      <div onClick={() => handleMonth(true)}>next</div>
      <table>
        <thead>
          {weekDays.map((ele) => (
            <th>{ele}</th>
          ))}
        </thead>
        <tbody>
          {dateArray.map((week, i) => (
            <tr key={i}>
              {week.map((cell, idx) => (
                <td key={idx}>
                  {cell.currentMonth ? (
                    <label>
                      <input
                        type="radio"
                        name="date"
                        value={new Date(year, month, cell.day).toISOString().substring(0, 10)}
                      />
                      {cell.day}
                    </label>
                  ) : (
                    <div> {cell.day}</div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Calendar;
