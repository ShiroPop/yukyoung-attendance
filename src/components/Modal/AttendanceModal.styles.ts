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
  z-index: 1;
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
  height: 60%;
  border: 1px solid #cecece;
  border-radius: 16px;
  padding: 12px 16px;
  margin-bottom: 30px;
  background-color: white;
  overflow: hidden;
  text-align: right;
`;

export const LogoutIcon = styled(CloseIconRaw)`
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

export const ListWrap = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const ChildrenList = styled.div`
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-columns: 2fr 1fr;
  padding: 12px 30px;
`;

export const StyledToggleSwitch = styled.label<{ $state?: number }>`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  background-color: ${({ $state }) => ($state ? "#cecece" : "#76c078")};
  border-radius: 34px;
  transition: background-color 0.2s;
  cursor: pointer;

  input {
    display: none;
  }

  span {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 22px;
    height: 22px;
    background-color: white;
    border-radius: 50%;
    transition: left 0.2s;
  }

  input:checked + span {
    left: 26px;
  }

  input:checked + span::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    width: 50px;
    height: 26px;
    background-color: #76c078;
    border-radius: 34px;
    z-index: -1;
  }
`;

export const StyledHolidayButton = styled.button<{ $isHoliday: boolean }>`
  width: 100%;
  height: 44px;
  background-color: ${({ $isHoliday }) => ($isHoliday ? "#ff9696" : "#76c078")};
  color: #fff;
  border: none;
  border-radius: 99px;
  font-size: 16px;
  transition: background-color 0.5s, color 0.2s;
  margin-top: 20px;
  cursor: pointer;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ $isHoliday }) => ($isHoliday ? "#ff96964d" : "#76c0784d")};
    }
  }
`;
