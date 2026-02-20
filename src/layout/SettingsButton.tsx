import styled from "styled-components";
import { ReactComponent as SettingsIconRaw } from "../assets/settings.svg";
import { useManagementModalStore } from "../store/managementModalStore";

const SettingsIcon = styled(SettingsIconRaw)`
  width: 28px;
  height: 28px;
  fill: #76c078;
  cursor: pointer;
  transition: fill 0.5s;

  &:hover {
    fill: #76c0784d;
  }
  @media (min-width: 910px) {
    width: 20px;
    height: 20px;
  }
`;

const Button = styled.div`
  position: absolute;
  top: 7px;
  right: 42px;

  display: flex;
  flex-direction: row-reverse;
  align-items: center;

  &::after {
    content: "";
    display: none;
    margin-right: 6px;
    font-size: 18px;
    font-weight: 600;
    transition: color 0.5s;
    color: #76c078;
  }

  @media (min-width: 910px) {
    right: unset;
    top: 6px;
    left: 6px;
    &::after {
      content: "관리";
      display: inline;
    }
    &:hover {
      &::after {
        color: #76c0784d;
      }
    }
    &:hover ${SettingsIcon} {
      fill: #76c0784d;
    }
  }
`;

const SettingsButton = () => {
  const { openModal } = useManagementModalStore();
  return (
    <Button onClick={openModal}>
      <SettingsIcon />
    </Button>
  );
};

export default SettingsButton;
