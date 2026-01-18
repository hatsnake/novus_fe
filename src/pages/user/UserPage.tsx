import { useEffect, useState } from "react";
import { fetchWithAccess } from "@/util/fetchUtil";
import { Container, Box, Typography, CircularProgress, Alert, Stack, Button, TextField, IconButton, Avatar, Badge, styled } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CameraAltIcon from '@mui/icons-material/CameraAlt'; // 아이콘 추가
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";
import NaverIcon from "@/components/common/icons/NaverIcon";
import GoogleIcon from "@/components/common/icons/GoogleIcon";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ToastMessage from "@/components/common/ToastMessage";
import { BACKEND_API_BASE_URL } from "@/config/backend";
import DefaultImage from 'boring-avatars';

// 파일 인풋 숨김 처리 스타일 (MUI 권장 방식)
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const UserPage = () => {
    const navigate = useNavigate();
    const logout = useAuthStore((s) => s.logout);

    // profileImage 타입 추가
    const [userInfo, setUserInfo] = useState<{ username: string; nickname: string; email: string, social: boolean, socialProviderType: string, profileImage?: string } | null>(null);
    const [error, setError] = useState<string>('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [updateConfirmOpen, setUpdateConfirmOpen] = useState(false);

    const [editNickname, setEditNickname] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);

    // [추가] 이미지 관련 상태
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const NAVER_PROVIDER = 'NAVER';
    const GOOGLE_PROVIDER = 'GOOGLE';

    const profileImgUrl = getImageUrl(userInfo?.profileImage);

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
            if (data.profileImage) {
                setPreviewUrl(getImageUrl(data.profileImage));
            }
        } catch (err) {
            setError("유저 정보를 불러오지 못했습니다.");
        }
    };

    // [추가] 파일 선택 핸들러
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async () => {
        // 비정상적인 호출 방지
        if (!userInfo?.username) {
            setError("사용자 식별 정보(아이디)가 없습니다.");
            return;
        }

        const formData = new FormData();
        const userDto = {
            username: userInfo.username,
            nickname: editNickname,
            email: editEmail
        };
        const jsonBlob = new Blob([JSON.stringify(userDto)], { type: "application/json" });
        formData.append("dto", jsonBlob, "user.json");

        if (avatarFile) {
            formData.append("profileImage", avatarFile);
        }

        setUpdateLoading(true);
        setError('');
        try {
            // [수정] Content-Type 헤더 제거 (FormData 자동 설정)
            const res = await fetchWithAccess(`/user`, {
                method: 'PATCH',
                credentials: "include",
                body: formData,
            });

            if (!res.ok) throw new Error("정보 수정 실패");

            const updatedData = await res.json();
            setUserInfo(prev => ({ ...(prev ?? {}), ...updatedData }));
            
            // 프리뷰 업데이트
            if (updatedData.profileImage) {
                setPreviewUrl(getImageUrl(updatedData.profileImage));
            }

            setToastMessage('정보가 수정되었습니다.');
            setToastOpen(true);
            setAvatarFile(null); // 업로드 후 파일 초기화
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

    function getImageUrl (path: string | undefined) {
        if (!path) return '';
        // 이미 http로 시작하면(외부 링크, S3 등) 그대로 사용
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        // 아니면 백엔드 주소 붙이기
        return `${BACKEND_API_BASE_URL}${path}`;
    }

    const renderAvatar = (size: number) => {
        if (profileImgUrl) {
            return <Avatar src={profileImgUrl} sx={{ width: size, height: size, bgcolor: 'background.paper' }} />;
        }
        return (
        <Box sx={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', lineHeight: 0 }}>
            <DefaultImage
            size={size}
            name={userInfo?.nickname || 'user'} // 이름 기반으로 패턴 생성
            variant="beam" // 'marble', 'beam', 'pixel', 'sunset', 'ring', 'bauhaus'
            colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
            />
        </Box>
        );
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
                        {/* [수정] 프로필 이미지 및 입력 폼 영역 통합 */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
                            <Typography variant="h6">프로필 이미지</Typography>
                            {/* [추가] 프로필 이미지 업로드 UI */}
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    !userInfo.social && (
                                        <IconButton
                                            component="label"
                                            sx={{ 
                                                bgcolor: 'primary.main', 
                                                color: 'white',
                                                '&:hover': { bgcolor: 'primary.dark' },
                                                width: 32, height: 32,
                                                boxShadow: 2
                                            }}
                                        >
                                            <CameraAltIcon sx={{ fontSize: 18 }} />
                                            <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
                                        </IconButton>
                                    )
                                }
                            >
                                {renderAvatar(120)}
                            </Badge>

                            {/* 기존 입력 필드 영역 (width 100% 추가) */}
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                        </Box>

                        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                            {!userInfo.social && (
                                <Button 
                                    variant="contained"
                                    size="large"
                                    disableElevation
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
                            
                            {/* 기존 코드 유지 */}
                            {userInfo.social ? (
                                <Typography sx={{ color: 'error.main', flex: 1, alignSelf: 'center' }}>
                                    ※ 소셜 로그인 회원은 탈퇴할 수 없습니다.
                                </Typography>
                            ) : (
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    disableElevation
                                    onClick={() => setConfirmOpen(true)}
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
            />

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