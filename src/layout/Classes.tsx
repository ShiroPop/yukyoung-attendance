import { useRef, useState } from "react";
import { useClassesStore } from "../store/classesStore";
import styled from "styled-components";
import { useClassesQuery } from "../hooks/useQuery";

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

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: #76c0784d;
    }
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
  const { setClassId } = useClassesStore();

  const [selectedClass, setSelectedClass] = useState("all");

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

  const { data } = useClassesQuery();

  return (
    <>
      <ScrollContainer
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <ClassLabel selected={selectedClass === "all"}>
          <ClassInput
            type="radio"
            name="class"
            onChange={() => {
              setSelectedClass("all");
              setClassId({ id: "all" });
            }}
          />
          <AntiDrag>전체</AntiDrag>
        </ClassLabel>
        {data?.map((ele) => (
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
