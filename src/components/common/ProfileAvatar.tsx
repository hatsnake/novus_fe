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

type ProfileAvatarProps = {
  // 필요시 props 정의
};

const ProfileAvatar = ({ }: ProfileAvatarProps) => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const userInfo = {
    name: user?.nickname || 'Guest',
    email: user?.email || '',
    role: user?.role || 'MEMBER'
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

  return (
    <>
      <Tooltip title="계정 설정">
        <IconButton
          onClick={handleMenuOpen}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }} />
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
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
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
          <Avatar sx={{ width: 48, height: 48 }} alt={userInfo.name} />
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
