import { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/stores/useAuthStore';
import ProfileAvatar from './ProfileAvatar';

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const user = useAuthStore((s) => s.user);
  const fetchUser = useAuthStore((s) => s.fetchUser);

  useEffect(() => {
    if (isLoggedIn && !user) {
      fetchUser();
    }
  }, [isLoggedIn, user, fetchUser]);

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
             <ProfileAvatar />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
