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

const Input = styled.input``;

const Button = styled.button``;

const Login = () => {
  const { loginId } = useAuth();
  const { loginError } = useUserStore();
  const [user, setUser] = useState("");

  const handleLogin = async () => {
    await loginId(user);
  };
  return (
    <>
      <Container>
        <Input type="text" placeholder="아이디를 입력해주세요." onChange={(e) => setUser(e.target.value)} />
        <div>{loginError}</div>
        <Button onClick={handleLogin}>로그인</Button>
      </Container>
    </>
  );
};

export default Login;
