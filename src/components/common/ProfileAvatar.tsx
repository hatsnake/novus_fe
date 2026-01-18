import { 
  Box, Typography, Button, IconButton, Avatar, Menu, MenuItem, Tooltip, Divider, Chip 
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Logout as LogoutIcon,
  Settings as SettingsIcon 
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/stores/useAuthStore';
import { BACKEND_API_BASE_URL } from '@/config/backend';
import DefaultImage from 'boring-avatars';

type ProfileAvatarProps = {
  // 필요시 props 정의
};

const ProfileAvatar = ({ }: ProfileAvatarProps) => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const profileImgUrl = getImageUrl(user?.profileImage);

  const userInfo = {
    name: user?.nickname || '',
    nickname: user?.nickname || '',
    email: user?.email || '',
    role: user?.role || ''
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMyInfo = () => {
    handleMenuClose();
    navigate('/user');
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/');
  };

  function getImageUrl (path: string | undefined) {
      if (!path) return '';
      // 이미 http로 시작하면(외부 링크, S3 등) 그대로 사용
      if (path.startsWith('http://') || path.startsWith('https://')) return path;
      // 아니면 백엔드 주소 붙이기
      return `${BACKEND_API_BASE_URL}${path}`;
  }

  // 아바타 렌더링 헬퍼 함수
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
    <>
      <Tooltip title="">
        <IconButton
          onClick={handleMenuOpen}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          {/* 상단 아이콘 아바타 */}
          {renderAvatar(32)}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              minWidth: 280, // 카드 너비 확보
              borderRadius: 2, // 둥근 모서리
              // MuiAvatar override 제거 (renderAvatar에서 직접 스타일링하므로)
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }
        }}
      >
        {/* 상단 프로필 영역 */}
        <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* 메뉴 내부 큰 아바타 */}
          {renderAvatar(48)}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight="bold" noWrap>
              {userInfo.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {userInfo.email}
            </Typography>
          </Box>
        </Box>
        
        <Divider />

        {/* 메뉴 리스트 영역 */}
        <Box sx={{ py: 1 }}>
          <MenuItem onClick={handleMyInfo} sx={{ py: 1.5, px: 2.5 }}>
            <PersonIcon fontSize="small" sx={{ mr: 2, color: 'text.secondary' }} />
            <Typography variant="body2">내 정보</Typography>
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.5, px: 2.5 }}>
            <SettingsIcon fontSize="small" sx={{ mr: 2, color: 'text.secondary' }} />
            <Typography variant="body2">설정</Typography>
          </MenuItem>
        </Box>

        <Divider />

        {/* 하단 액션 버튼 영역 */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', bgcolor: 'grey.50' }}>
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<LogoutIcon />} 
            onClick={handleLogout}
            disableElevation
            sx={{ textTransform: 'none' }}
          >
            로그아웃
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default ProfileAvatar;
