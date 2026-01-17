import { useEffect, useState } from "react";
import { fetchWithAccess } from "@/util/fetchUtil";
import { Container, Box, Typography, CircularProgress, Alert, Stack, Button, TextField, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";
import NaverIcon from "@/components/common/icons/NaverIcon";
import GoogleIcon from "@/components/common/icons/GoogleIcon";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ToastMessage from "@/components/common/ToastMessage";

const UserPage = () => {
    const navigate = useNavigate();
    const logout = useAuthStore((s) => s.logout);

    const [userInfo, setUserInfo] = useState<{ username: string; nickname: string; email: string, social: boolean, socialProviderType: string } | null>(null);
    const [error, setError] = useState<string>('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [updateConfirmOpen, setUpdateConfirmOpen] = useState(false);

    const [editNickname, setEditNickname] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);

    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const NAVER_PROVIDER = 'NAVER';
    const GOOGLE_PROVIDER = 'GOOGLE';

    // 페이지 방문시 유저 정보 요청
    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const res = await fetchWithAccess(`/user`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) throw new Error("유저 정보 불러오기 실패");

            const data = await res.json();
            setUserInfo(data);
            setEditNickname(data.nickname);
            setEditEmail(data.email);
        } catch (err) {
            setError("유저 정보를 불러오지 못했습니다.");
        }
    };

    const handleUpdate = async () => {
        // 비정상적인 호출 방지
        if (!userInfo?.username) {
            setError("사용자 식별 정보(아이디)가 없습니다.");
            return;
        }

        const payload = {
            username: userInfo.username,
            nickname: editNickname,
            email: editEmail,
        }

        setUpdateLoading(true);
        setError('');
        try {
            const res = await fetchWithAccess(`/user`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("정보 수정 실패");

            const updatedData = await res.json();
            setUserInfo(prev => ({ ...(prev ?? {}), ...updatedData }));
            setToastMessage('정보가 수정되었습니다.');
            setToastOpen(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUpdateLoading(false);
            setUpdateConfirmOpen(false);
        }
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        setError('');
        try {
            const res = await fetchWithAccess(`/user`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: userInfo?.username }),
            });

            if (!res.ok) {
                let message = '회원 탈퇴에 실패했습니다.';
                try {
                    const body = await res.json();
                    message = body?.message || message;
                } catch {}
                throw new Error(message);
            }

            try { await logout(); } catch {}
            navigate('/', { replace: true });
        } catch (err: any) {
            setError(err?.message || '회원 탈퇴 실패');
        } finally {
            setDeleteLoading(false);
            setConfirmOpen(false);
        }
    };

    const handleToastClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setToastOpen(false);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4" gutterBottom>내 정보</Typography>

                {error && <Alert severity="error">{error}</Alert>}

                {!userInfo ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {userInfo.social ? (
                                <>
                                    {userInfo.socialProviderType === NAVER_PROVIDER && (
                                        <NaverIcon />
                                    )}
                                    {userInfo.socialProviderType === GOOGLE_PROVIDER && (
                                        <GoogleIcon />
                                    )}
                                    <Typography variant="body1">
                                        이메일: <strong>{userInfo.email}</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        닉네임: <strong>{userInfo.nickname}</strong>
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <TextField
                                        label="이메일"
                                        fullWidth
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        helperText="수정할 이메일을 입력하세요."
                                    />
                                    <TextField
                                        label="닉네임"
                                        fullWidth
                                        value={editNickname}
                                        onChange={(e) => setEditNickname(e.target.value)}
                                        helperText="수정할 닉네임을 입력하세요."
                                    />
                                </>
                            )}
                        </Box>

                        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                            {!userInfo.social && (
                                <Button 
                                    variant="contained"
                                    size="large"
                                    onClick={() => setUpdateConfirmOpen(true)}
                                    disabled={updateLoading}
                                    sx={{ flex: 1, bgcolor: 'warning.light' }}
                                    component="span"
                                >
                                    <IconButton aria-label="edit" size="small" sx={{color: 'white', mr: 1}}>
                                        <BorderColorIcon fontSize="small" />
                                    </IconButton>
                                    {updateLoading ? <CircularProgress size={24} /> : '정보 수정'}
                                </Button>
                            )}

                            {userInfo.social ? (
                                <Typography sx={{ color: 'error.main', flex: 1, alignSelf: 'center' }}>
                                    ※ 소셜 로그인 회원은 탈퇴할 수 없습니다.
                                </Typography>
                            ) : (
                                <Button 
                                    variant="contained" 
                                    onClick={() => setConfirmOpen(true)}
                                    size="large"
                                    sx={{ flex: 1, bgcolor: 'error.main' }}
                                    component="span"
                                >
                                    <IconButton aria-label="delete" size="small" sx={{color: 'white', mr: 1}}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                    회원 탈퇴
                                </Button>
                            )}
                        </Stack>
                    </>
                )}
            </Box>

            {/* replaced dialogs with ConfirmDialog component */}
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
                title="회원 탈퇴"
                description="탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다. 계정을 삭제하면 되돌릴 수 없습니다."
                icon={<DeleteIcon color="error" />}
                confirmText="탈퇴하기"
                cancelText="취소"
                confirmColor="error"
                loading={deleteLoading}
            />

            <ConfirmDialog
                open={updateConfirmOpen}
                onClose={() => setUpdateConfirmOpen(false)}
                onConfirm={handleUpdate}
                title="정보 수정"
                description="입력한 정보로 변경하시겠습니까? 변경 후 즉시 적용됩니다."
                icon={<BorderColorIcon sx={{ color: 'warning.main' }} />}
                confirmText="수정하기"
                cancelText="취소"
                confirmColor="warning"
                loading={updateLoading}
            >
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">이메일: <strong>{editEmail}</strong></Typography>
                    <Typography variant="body2">닉네임: <strong>{editNickname}</strong></Typography>
                </Box>
            </ConfirmDialog>

            <ToastMessage
              open={toastOpen}
              severity={"success"}
              message={toastMessage}
              onClose={handleToastClose}
            />
        </Container>
    );
}

export default UserPage;