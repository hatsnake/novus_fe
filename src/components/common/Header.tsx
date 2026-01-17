import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/stores/useAuthStore';

const Header= () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const logout = useAuthStore((s) => s.logout);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>Novus</Typography>

        {!isLoggedIn ? (
          <Box>
            <Button color="inherit" onClick={() => navigate('/login')}>로그인</Button>
            <Button color="inherit" onClick={() => navigate('/join')}>회원가입</Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" onClick={() => navigate('/user')}>내 정보</Button>
            <Button color="inherit" onClick={async () => { await logout(); navigate('/'); }}>로그아웃</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
