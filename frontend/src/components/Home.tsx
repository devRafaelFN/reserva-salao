import { Container, Typography, Button, Box, Paper } from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Reservas', path: '/reservas', description: 'Gerencie as reservas do salão', icon: <EventSeatIcon fontSize="large" /> },
    { title: 'Usuários', path: '/usuarios', description: 'Gerencie os usuários do sistema', icon: <PeopleIcon fontSize="large" /> },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box className="app-hero" sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontFamily: 'Poppins, Inter' }}>
          Painel de Controle
        </Typography>
        <Typography variant="body1" color="text.secondary">Acesse as áreas do sistema para gerenciar reservas e moradores.</Typography>
      </Box>
      
      <Box sx={{ display: 'grid', gap: 3, mt: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
        {menuItems.map((item) => (
          <Paper 
            key={item.path}
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 200ms ease, box-shadow 200ms ease',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 12px 30px rgba(2,6,23,0.08)'
              },
              background: 'linear-gradient(180deg, rgba(0,102,255,0.03), rgba(0,191,166,0.01))'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ color: 'primary.main' }}>{item.icon}</Box>
              <Box>
                <Typography variant="h6" component="h2" gutterBottom sx={{ fontFamily: 'Poppins, Inter' }}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">{item.description}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate(item.path)}
              >
                Acessar
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default Home;
