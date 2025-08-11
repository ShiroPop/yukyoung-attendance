import styled from "styled-components";
import { useUserStore } from "../store/userStore";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const Container = styled.div`
  height: 100dvh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  height: 38px;
  width: 224px;
  border: 1px solid #4caf50;
  border-radius: 10px;
  outline: none;
  padding: 0 8px;

  &:focus {
    border: 1px solid #4caf50;
    outline: 1px solid #4caf50;
  }
  &::placeholder {
    color: #76c078;
  }
`;

const ErrorMessage = styled.span<{ $visibility: boolean }>`
  position: relative;
  min-height: 24px;
  top: 2px;
  font-size: 13px;
  font-weight: 600;
  color: #ff5959;
  visibility: ${({ $visibility }) => ($visibility ? "visible" : "hidden")};
`;

const Button = styled.button`
  height: 44px;
  width: 240px;
  margin-bottom: 20px;
  border: none;
  border-radius: 99px;
  background-color: #76c078;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.5s, color 0.2s;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: #76c0784d;
    }
  }
`;

const Login = () => {
  const { loginId } = useAuth();
  const { loginError } = useUserStore();

  const [user, setUser] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await loginId(user);
  };
  return (
    <>
      <Container>
        <Form onSubmit={handleLogin}>
          <Input
            type="text"
            lang="en"
            autoCapitalize="off"
            name="yukyoungId"
            autoComplete="yukyoungId"
            placeholder="아이디를 입력해주세요."
            onChange={(e) => setUser(e.target.value)}
          />
          <ErrorMessage $visibility={!!loginError}>{loginError || " "}</ErrorMessage>
          <Button type="submit">로그인</Button>
        </Form>
      </Container>
    </>
  );
};

export default Login;
