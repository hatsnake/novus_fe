import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, TextField, Button, Typography, Alert, Stack } from "@mui/material";
import { apiFetch } from '../util/fetchUtil';

const JoinPage = () => {
    const navigate = useNavigate();
    
    // 회원가입 변수
    const [username, setUsername] = useState<string>("");
    const [isUsernameValid, setIsUsernameValid] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [nickname, setNickname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            navigate("/");
        }
    }, [navigate]);

    // username 입력창 변경 이벤트
    useEffect(() => {
        // username 중복 확인
        const checkUsername = async () => {

            if (username.length < 4) {
                setIsUsernameValid(false);
                return;
            }

            try {
                const res = await apiFetch('/user/exist', {
                    method: 'POST',
                    body: JSON.stringify({ username }),
                });

                const exists = await res.json();
                setIsUsernameValid(!exists);
            } catch {
                setIsUsernameValid(false);
            }
        };

        const delay = setTimeout(checkUsername, 300);
        return () => clearTimeout(delay);
    }, [username]);

       // 회원 가입 이벤트
    const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setError("");

        if (
            username.length < 4 ||
            password.length < 4 ||
            nickname.trim() === "" ||
            email.trim() === ""
        ) {
            setError("입력값을 다시 확인해주세요. (모든 항목은 필수이며, ID/비밀번호는 최소 4자)");
            return;
        }

        try {
            const res = await apiFetch('/user', {
                method: 'POST',
                body: JSON.stringify({ username, password, nickname, email }),
            });

            if (!res.ok) throw new Error("회원가입 실패");
            navigate("/login");
            
        } catch {
            setError("회원가입 중 오류가 발생했습니다.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4" component="h1" align="center">회원 가입</Typography>

                <Box component="form" onSubmit={handleSignUp} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="아이디 (4자 이상)"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        slotProps={{ input: { minRows: 4 } }}
                        fullWidth
                    />

                    {username.length >= 4 && isUsernameValid === false && (
                        <Alert severity="error">이미 사용 중인 아이디입니다.</Alert>
                    )}
                    {username.length >= 4 && isUsernameValid === true && (
                        <Alert severity="success">사용 가능한 아이디입니다.</Alert>
                    )}

                    <TextField
                        label="비밀번호 (4자 이상)"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        slotProps={{ input: { minRows: 4 } }}
                        fullWidth
                    />

                    <TextField
                        label="닉네임"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                        fullWidth
                    />

                    <TextField
                        label="이메일"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                    />

                    {error && <Alert severity="error">{error}</Alert>}

                    <Stack direction="row" sx={{ width: '100%' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isUsernameValid !== true}
                            fullWidth
                            sx={{ height: 56, textTransform: 'none' }}
                        >
                            회원가입
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Container>
    )
}

export default JoinPage;