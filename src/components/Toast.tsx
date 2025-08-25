import styled from "styled-components";
import { useToastStore } from "../store/toastStore";

const ToastWrap = styled.div<{ $visible: boolean; $type: "success" | "error"; index: number }>`
  position: fixed;
  bottom: ${({ index }) => 30 + index * 60}px;
  right: 30px;
  padding: 12px 20px;
  background: ${({ $type }) => ($type === "success" ? "#75C078" : "#FF5959")};
  color: #fff;
  border-radius: 8px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? "translateY(0)" : "translateY(20px)")};
  transition: all 0.3s ease;
`;

const Toast = () => {
  const { toasts } = useToastStore();
  return (
    <>
      {toasts.map((toast, idx) => (
        <ToastWrap key={toast.id} $visible={true} $type={toast.type} index={idx}>
          {toast.message}
        </ToastWrap>
      ))}
    </>
  );
};

export default Toast;
