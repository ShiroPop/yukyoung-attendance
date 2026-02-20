import styled from "styled-components";
import { ReactComponent as CloseIconRaw } from "../../assets/close.svg";

export const ModalWrap = styled.div<{ $isModal: boolean }>`
  position: absolute;
  display: ${({ $isModal }) => ($isModal ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100dvh;
  height: 100vh;
  z-index: 2;
  top: 0;
  backdrop-filter: blur(2px);
  overflow: hidden;
`;

export const ModalBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  min-width: 200px;
  max-width: 400px;
  max-height: 60%;
  border: 1px solid #cecece;
  border-radius: 16px;
  padding: 12px 16px;
  margin-bottom: 30px;
  background-color: white;
  overflow: hidden;
  text-align: right;
`;

export const CloseIcon = styled(CloseIconRaw)`
  width: 24px;
  height: 24px;
  padding: 0 0 4px;
  fill: #00000030;
  cursor: pointer;
  transition: fill 0.5s;

  &:hover {
    fill: #000000;
  }
`;

export const AddRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px 0;
  align-items: center;
`;

export const DateInput = styled.input`
  flex: 1;
  border: 1px solid #4caf50;
  border-radius: 999px;
  padding: 6px 12px;
  outline: none;
  color: #76c078;
  font-size: 14px;
`;

export const AddButton = styled.button`
  background-color: #76c078;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 6px 14px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  transition: background-color 0.5s;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: #76c0784d;
    }
  }
`;

export const ListWrap = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 8px;
`;

export const SemesterItem = styled.div<{ $active: boolean }>`
  padding: 10px 12px;
  cursor: pointer;
  text-align: left;
  border-bottom: 1px dashed #cecece;
  color: ${({ $active }) => ($active ? "#fff" : "#76c078")};
  background-color: ${({ $active }) => ($active ? "#76c078" : "#fff")};
  transition: background-color 0.3s, color 0.2s;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ $active }) => ($active ? "#76c078" : "#76c0784d")};
    }
  }
`;
