import { Container, Box, Typography } from "@mui/material";

const MainPage = () => {
    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Typography variant="h4">Main Page</Typography>
                <Typography variant="body1" color="text.secondary">
                    
                </Typography>
            </Box>
        </Container>
    );
};

export default MainPage;