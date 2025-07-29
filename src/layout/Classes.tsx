import { useEffect, useRef, useState } from "react";
import { fetchCollection } from "../utils/firestore";
import { useClassesStore } from "../store/classesStore";
import styled from "styled-components";
import { useSemesterStore } from "../store/semesterStore";

const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding: 12px 8px;
  border-top: 1px solid #00000030;
  background-color: #fff;
  cursor: grab;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  &:active {
    cursor: grabbing;
  }
`;

const ClassLabel = styled.label<{ selected: boolean }>`
  border: 1px solid #4caf50;
  background-color: ${({ selected }) => (selected ? "#76c078" : "#fff")};
  color: ${({ selected }) => (selected ? "#fff" : "#76c078")};
  padding: 6px 12px;
  margin-right: 8px;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.5s, color 0.2s;

  &:hover {
    background-color: #76c0784d;
  }
`;

const AntiDrag = styled.span`
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const ClassInput = styled.input`
  display: none;
`;

//
// 달력 max width가 정해지면 이쪽도 maxwidth...
// hover -> 모바일에서는 클릭시 작동하는 이슈
//

const Classes = () => {
  const { classes, setClasses, setClassId } = useClassesStore();
  const { semester } = useSemesterStore();

  const [selectedClass, setSelectedClass] = useState("전체");

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    scrollRef.current.classList.add("dragging");
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    scrollRef.current?.classList.remove("dragging");
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    scrollRef.current?.classList.remove("dragging");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  //
  // 유즈쿼리로 바꾸기
  //
  useEffect(() => {
    if (!semester) return;
    fetchCollection(["semester", semester, "class"]).then(setClasses);
  }, [semester]);

  return (
    <>
      <ScrollContainer
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <ClassLabel selected={selectedClass === "전체"}>
          <ClassInput
            type="radio"
            name="class"
            onChange={() => {
              setSelectedClass("전체");
              setClassId({ id: "전체" });
            }}
          />
          <AntiDrag>전체</AntiDrag>
        </ClassLabel>
        {classes?.map((ele) => (
          <ClassLabel key={ele.id} selected={selectedClass === ele.id}>
            <ClassInput
              type="radio"
              name="class"
              onChange={() => {
                setSelectedClass(ele.id);
                setClassId(ele);
              }}
            />
            <AntiDrag>{ele.id}</AntiDrag>
          </ClassLabel>
        ))}
      </ScrollContainer>
    </>
  );
};

export default Classes;
