import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, CircularProgress, Box } from '@mui/material';

export default function AdminStatisticPage() {
  const [plots, setPlots] = useState({
    fitness: null,
    musculation: null,
    piscine: null
  });
  const [loading, setLoading] = useState({
    fitness: true,
    musculation: true,
    piscine: true
  });
  const [error, setError] = useState({
    fitness: null,
    musculation: null,
    piscine: null
  });

  // Récupérer les données des graphiques
  useEffect(() => {
    const fetchPlots = async () => {
      try {
        // Récupérer le graphique fitness
        try {
          const fitnessRes = await fetch('http://localhost:5000/api/generate-fitness-plot');
          if (!fitnessRes.ok) throw new Error('Échec de la récupération des données fitness');
          const fitnessData = await fitnessRes.json();
          setPlots(prev => ({ ...prev, fitness: fitnessData.image }));
        } catch (err) {
          setError(prev => ({ ...prev, fitness: err.message }));
        } finally {
          setLoading(prev => ({ ...prev, fitness: false }));
        }

        // Récupérer le graphique musculation
        try {
          const muscuRes = await fetch('http://localhost:5000/api/generate-musculation-plot');
          if (!muscuRes.ok) throw new Error('Échec de la récupération des données musculation');
          const muscuData = await muscuRes.json();
          setPlots(prev => ({ ...prev, musculation: muscuData.image }));
        } catch (err) {
          setError(prev => ({ ...prev, musculation: err.message }));
        } finally {
          setLoading(prev => ({ ...prev, musculation: false }));
        }

        // Récupérer le graphique piscine
        try {
          const piscineRes = await fetch('http://localhost:5000/api/generate-piscine-plot');
          if (!piscineRes.ok) throw new Error('Échec de la récupération des données piscine');
          const piscineData = await piscineRes.json();
          setPlots(prev => ({ ...prev, piscine: piscineData.image }));
        } catch (err) {
          setError(prev => ({ ...prev, piscine: err.message }));
        } finally {
          setLoading(prev => ({ ...prev, piscine: false }));
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des graphiques:', err);
      }
    };

    fetchPlots();
  }, []);

  const renderPlotCard = (title, plotKey) => (
    <Grid item xs={12} md={4}>
      <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: 300,
          width: '100%'
        }}>
          {loading[plotKey] ? (
            <CircularProgress />
          ) : error[plotKey] ? (
            <Typography color="error">{error[plotKey]}</Typography>
          ) : plots[plotKey] ? (
            <img 
              src={`data:image/png;base64,${plots[plotKey]}`} 
              alt={title}
              style={{ maxWidth: '100%', maxHeight: 300, display: 'block', margin: '0 auto' }}
            />
          ) : (
            <Typography>Aucune donnée disponible</Typography>
          )}
        </Box>
      </Paper>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Tableau de Bord Statistique Administrateur
      </Typography>
      
      <Grid container spacing={3} justifyContent="center">
        {renderPlotCard('Popularité des Activités Fitness', 'fitness')}
        {renderPlotCard('État des Équipements de Musculation', 'musculation')}
        {renderPlotCard('Fréquentation de la Piscine', 'piscine')}
      </Grid>
    </Container>
  );
}