import { useEffect, useState } from "react";
import { SOCIAL_PROVIDERS, type SocialProvider } from "../constants/SocialProvider";
import { useNavigate } from "react-router-dom";
import { Container, Box, TextField, Button, Typography, Alert, Stack, IconButton, Tooltip, Divider } from "@mui/material";
import useAuthStore from '../stores/useAuthStore';
import { apiFetch } from '../util/fetchUtil';
import { BACKEND_API_BASE_URL } from '../config/backend';
import GoogleIcon from "../components/icons/GoogleIcon";
import NaverIcon from "../components/icons/NaverIcon";

const LoginPage = () => {
    const navigate = useNavigate();
    const loginStore = useAuthStore((s: import('../stores/useAuthStore').AuthState) => s.login);

    // 자체 로그인시 username/password 변수
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            navigate("/");
        }
    }, [navigate]);

    // 자체 로그인 이벤트
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (username === "" || password === "") {
            setError("아이디와 비밀번호를 입력하세요.");
            return;
        }

        // API 요청
        try {
            const res = await apiFetch('/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) throw new Error("로그인 실패");

            const data = await res.json();
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            // update zustand store
            loginStore(data.accessToken, data.refreshToken);

            navigate("/");
        } catch (err) {
            setError("아이디 또는 비밀번호가 틀렸습니다.");
        }
    };

    // 소셜 로그인 이벤트
    const handleSocialLogin = (provider: SocialProvider) => {
        window.location.href = `${BACKEND_API_BASE_URL}/oauth2/authorization/${provider}`;
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>로그인</Typography>

                <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                    <TextField
                        label="아이디"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <TextField
                        label="비밀번호"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}

                    <Stack direction="row" sx={{ width: '100%', mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ height: 56, textTransform: 'none' }}
                        >
                            로그인
                        </Button>
                    </Stack>

                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 3 }}>
                        <Button size="small" variant="text" onClick={() => navigate('/find-id')} sx={{ textTransform: 'none', color: '#0000008a' }}>아이디 찾기</Button>
                        <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center' }} />
                        <Button size="small" variant="text" onClick={() => navigate('/find-password')} sx={{ textTransform: 'none', color: '#0000008a' }}>비밀번호 찾기</Button>
                        <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center' }} />
                        <Button size="small" variant="text" onClick={() => navigate('/join')} sx={{ textTransform: 'none', color: '#0000008a' }}>회원가입</Button>
                    </Stack>
                </Box>

                {/* 구분선 + 텍스트 */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                    <Divider sx={{ flex: 1 }} />
                    <Typography variant="caption" sx={{ mx: 2, color: 'text.secondary' }}>또는</Typography>
                    <Divider sx={{ flex: 1 }} />
                </Stack>

                {/* 중앙 정렬된 소셜 원형 아이콘 그룹 (화이트 써클 + 아이콘) */}
                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                    <Tooltip title="네이버 로그인">
                        <IconButton
                            onClick={() => handleSocialLogin(SOCIAL_PROVIDERS.NAVER)}
                            aria-label="네이버 로그인"
                            disableRipple
                            disableFocusRipple
                        >
                            <NaverIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="구글 로그인">
                        <IconButton
                            onClick={() => handleSocialLogin(SOCIAL_PROVIDERS.GOOGLE)}
                            aria-label="구글 로그인"
                            disableRipple
                            disableFocusRipple
                        >
                            <GoogleIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>
        </Container>
    );
}

export default LoginPage;