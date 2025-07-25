import { useEffect, useRef, useState } from "react";
import { fetchCollection } from "../utils/firestore";
import { useClassesStore } from "../store/classesStore";
import styled from "styled-components";

interface ClassesType {
  id: string;
  semester_id: string;
  name: string;
}

const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding: 0.5rem;
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

const Classes = () => {
  const { classes, setClasses, setClassType } = useClassesStore();

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

  useEffect(() => {
    fetchCollection("class").then((data) => {
      setClasses(data);
    });
  }, []);

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
          <ClassInput type="radio" name="class" onChange={() => setSelectedClass("전체")} />
          <AntiDrag>전체</AntiDrag>
        </ClassLabel>
        {classes?.map((ele) => (
          <ClassLabel selected={selectedClass === ele.name}>
            <ClassInput
              type="radio"
              name="class"
              onChange={() => {
                setSelectedClass(ele.name);
                setClassType(ele);
              }}
            />
            <AntiDrag>{ele.name}</AntiDrag>
          </ClassLabel>
        ))}
      </ScrollContainer>
    </>
  );
};

export default Classes;
