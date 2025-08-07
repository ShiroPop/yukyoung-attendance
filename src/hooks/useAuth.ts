import { useState, useEffect, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useUserStore } from "../store/userStore";
import { useDateStore } from "../store/dateStore";
import { usePopupStore } from "../store/popupStore";
import { db } from "../firestore";
import { useClassesStore } from "../store/classesStore";

interface UserWithoutId {
  role: string;
  assigned_classes: string[];
}

const LOGIN_EXPIRATION_MINUTES = 20;
const LOGIN_EXPIRATION_MS = LOGIN_EXPIRATION_MINUTES * 60 * 1000;

let logoutTimer: ReturnType<typeof setTimeout>; // 전역 타이머

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const { setUser, setLoginError } = useUserStore();
  const { resetDate } = useDateStore();
  const { resetPopup } = usePopupStore();
  const { setClassId } = useClassesStore();

  // 로그아웃
  const logout = useCallback(() => {
    resetDate();
    resetPopup();
    setClassId({ id: "all" });
    clearTimeout(logoutTimer);
    setUser(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("loginTime");
  }, [resetDate, resetPopup, setUser, setClassId]);

  // 로그아웃 타이머 설정
  const setLogoutTimer = useCallback(
    (ms: number) => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        logout();
      }, ms);
    },
    [logout]
  );

  // 수동 로그인
  const loginId = async (userId: string) => {
    setLoading(true);
    try {
      const docRef = doc(db, "user", userId);
      const snapshot = await getDoc(docRef);
      setLoginError("");

      if (!snapshot.exists()) {
        setLoginError("존재하지 않는 사용자 입니다.");
        return;
      }

      const userData = snapshot.data() as UserWithoutId;
      setUser({ id: userId, ...userData });

      const now = Date.now();
      localStorage.setItem("userId", userId);
      localStorage.setItem("loginTime", now.toString());

      setLogoutTimer(LOGIN_EXPIRATION_MS); // 30분 타이머 시작
    } catch (error) {
      console.error("로그인 에러:", error);
      setLoginError("존재하지 않는 사용자 입니다.");
    } finally {
      setLoading(false);
    }
  };

  // 자동 로그인
  const autoLogin = useCallback(
    async (userId: string, loginTime: number) => {
      try {
        const docRef = doc(db, "user", userId);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
          logout();
          return;
        }

        const userData = snapshot.data() as UserWithoutId;
        setUser({ id: userId, ...userData });

        const now = Date.now();
        const elapsed = now - loginTime;
        const remaining = LOGIN_EXPIRATION_MS - elapsed;

        if (remaining > 0) {
          setLogoutTimer(remaining);
        } else {
          logout();
        }
      } catch (error) {
        console.error("자동 로그인 에러:", error);
        logout();
      }
    },
    [logout, setUser, setLogoutTimer]
  );

  // 앱 로드 시 자동 로그인 시도
  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    const loginTimeStr = localStorage.getItem("loginTime");

    if (savedUserId && loginTimeStr) {
      const loginTime = parseInt(loginTimeStr, 10);
      autoLogin(savedUserId, loginTime);
    }
  }, [autoLogin]);

  // 앱 포커스 복귀 시 만료 검사
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const loginTimeStr = localStorage.getItem("loginTime");
        if (!loginTimeStr) return;

        const loginTime = parseInt(loginTimeStr, 10);
        const now = Date.now();
        const elapsedMinutes = (now - loginTime) / (1000 * 60);

        if (elapsedMinutes >= LOGIN_EXPIRATION_MINUTES) {
          logout(); // 시간 초과 시 로그아웃
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [logout]);

  return {
    loginId,
    logout,
    loading,
  };
};
