import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import { ReactComponent as LogoutIconRaw } from "../assets/logout.svg";

const LogoutIcon = styled(LogoutIconRaw)`
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
  right: 7px;

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
    top: unset;
    right: unset;
    bottom: 6px;
    left: 6px;
    &::after {
      content: "로그아웃";
      display: inline;
    }
    &:hover {
      &::after {
        color: #76c0784d;
      }
    }
    &:hover ${LogoutIcon} {
      fill: #76c0784d;
    }
  }
`;

const Logout = () => {
  const { logout } = useAuth();
  return (
    <>
      <Button onClick={logout}>
        <LogoutIcon />
      </Button>
    </>
  );
};

export default Logout;
