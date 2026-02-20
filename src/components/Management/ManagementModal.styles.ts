import styled from "styled-components";
import { ReactComponent as CloseIconRaw } from "../../assets/close.svg";

export const ModalWrap = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
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
  height: 70%;
  border: 1px solid #cecece;
  border-radius: 16px;
  padding: 12px 16px;
  margin-bottom: 30px;
  background-color: white;
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
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

export const TabContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
`;

export const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  height: 36px;
  border: 1px solid ${({ $active }) => ($active ? "#76c078" : "#cecece")};
  border-radius: 99px;
  background-color: ${({ $active }) => ($active ? "#76c078" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#333")};
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.5s, color 0.2s;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ $active }) => ($active ? "#76c078" : "#76c0781a")};
    }
  }
`;

export const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const InputRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

export const Input = styled.input`
  flex: 1;
  height: 44px;
  border: 1px solid #cecece;
  border-radius: 99px;
  padding: 0 16px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #76c078;
  }
`;

export const AddButton = styled.button`
  height: 44px;
  padding: 0 20px;
  border: none;
  border-radius: 99px;
  background-color: #76c078;
  color: #fff;
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.5s, color 0.2s;

  &:disabled {
    background-color: #cecece;
    cursor: not-allowed;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover:not(:disabled) {
      background-color: #76c0784d;
    }
  }
`;

export const ListItem = styled.div<{ $active?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background-color: ${({ $active }) => ($active ? "#76c0781a" : "transparent")};
  cursor: ${({ $active }) => ($active !== undefined ? "pointer" : "default")};
  transition: background-color 0.2s;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ $active }) => ($active ? "#76c0782d" : "#f8f8f8")};
    }
  }
`;

export const ListItemName = styled.span`
  font-size: 14px;
  color: #333;
`;

export const ActiveBadge = styled.span`
  font-size: 12px;
  color: #76c078;
  font-weight: 600;
`;

export const DeleteButton = styled.button`
  border: none;
  border-radius: 99px;
  background-color: #ff5959;
  color: #fff;
  font-size: 12px;
  padding: 6px 12px;
  cursor: pointer;
  transition: background-color 0.5s;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: #ff59594d;
    }
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 44px;
  border: 1px solid #cecece;
  border-radius: 99px;
  padding: 0 16px;
  font-size: 14px;
  outline: none;
  margin-bottom: 8px;
  background-color: #fff;
  appearance: none;

  &:focus {
    border-color: #76c078;
  }
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 24px;
  color: #999;
  font-size: 14px;
`;
