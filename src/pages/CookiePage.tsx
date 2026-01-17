import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Typography, CircularProgress } from "@mui/material";
import useAuthStore from "../stores/useAuthStore";
import { apiFetch } from '../util/fetchUtil';

const CookiePage = () => {
    const navigate = useNavigate();

    const loginStore = useAuthStore((s) => s.login);

    // 페이지 접근시 (백엔드에서 리디렉션으로 여기로 보내면, 실행)
    useEffect(() => {

        const cookieToBody = async () => {
            // 요청
            try {
                const res = await apiFetch("/jwt/exchange", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

                if (!res.ok) throw new Error("인증 실패");

                const data = await res.json();
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                loginStore(data.accessToken, data.refreshToken);

                navigate("/");
            } catch (err) {
                alert("소셜 로그인 실패");
                navigate("/login");
            }
        };

        cookieToBody();
    }, [navigate]);

    return (
        <Container maxWidth="sm">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    로그인 처리 중입니다...
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    페이지가 자동으로 이동하지 않으면 잠시 후 다시 시도하세요.
                </Typography>
            </Box>
        </Container>
    );
}

export default CookiePage;