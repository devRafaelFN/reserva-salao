import { Container, Typography, Button, Box, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Reservas', path: '/reservas', description: 'Gerencie as reservas do salão' },
    { title: 'Usuários', path: '/usuarios', description: 'Gerencie os usuários do sistema' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Painel de Controle
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <Grid item xs={12} md={6} key={item.path}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <Typography variant="h6" component="h2" gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="body1" paragraph sx={{ flexGrow: 1 }}>
                {item.description}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate(item.path)}
                >
                  Acessar
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
