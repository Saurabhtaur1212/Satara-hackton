import React, { useState, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  CloudUpload,
  Camera,
  BugReport,
  LocalHospital,
  Agriculture,
  Warning,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';
import { useTranslation } from 'react-i18next';
import { cropDetectionService } from '../services/api';

const CropDetection = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = React.useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(prev => ({ ...prev, preview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 to file
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          file.preview = imageSrc;
          setSelectedImage(file);
          setShowCamera(false);
        });
    }
  }, [webcamRef]);

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('language', localStorage.getItem('language') || 'en');

      const result = await cropDetectionService.detectDisease(formData);
      setDetectionResult(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        🌱 {t('cropDetection.title', 'AI Crop Disease Detection')}
      </Typography>
      
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        {t('cropDetection.subtitle', 'Upload or capture crop images to detect diseases, pests, and nutrient deficiencies')}
      </Typography>

      <Grid container spacing={4}>
        {/* Image Upload Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              📸 {t('cropDetection.uploadImage', 'Upload Crop Image')}
            </Typography>

            {!selectedImage ? (
              <Box>
                <Box
                  {...getRootProps()}
                  sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    mb: 2,
                    '&:hover': { borderColor: 'primary.main' }
                  }}
                >
                  <input {...getInputProps()} />
                  <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography>
                    {isDragActive
                      ? t('cropDetection.dropImage', 'Drop the image here')
                      : t('cropDetection.dragDrop', 'Drag & drop an image here, or click to select')
                    }
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<Camera />}
                  onClick={() => setShowCamera(true)}
                  fullWidth
                >
                  {t('cropDetection.useCamera', 'Use Camera')}
                </Button>
              </Box>
            ) : (
              <Box>
                <Card sx={{ mb: 2 }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={selectedImage.preview}
                    alt="Selected crop"
                  />
                </Card>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={analyzeImage}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <BugReport />}
                    fullWidth
                  >
                    {loading ? t('common.analyzing', 'Analyzing...') : t('cropDetection.analyze', 'Analyze Image')}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedImage(null);
                      setDetectionResult(null);
                    }}
                  >
                    {t('common.clear', 'Clear')}
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              📊 {t('cropDetection.results', 'Detection Results')}
            </Typography>

            {!detectionResult ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  {t('cropDetection.noResults', 'Upload an image to see detection results')}
                </Typography>
              </Box>
            ) : (
              <Box>
                {detectionResult.disease_detected ? (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                      {t('cropDetection.diseaseDetected', 'Disease Detected!')}
                    </Typography>
                  </Alert>
                ) : (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                      {t('cropDetection.healthy', 'Crop appears healthy!')}
                    </Typography>
                  </Alert>
                )}

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('cropDetection.diseaseType', 'Disease Type')}
                        </Typography>
                        <Typography variant="h6">
                          {detectionResult.disease_type || t('common.none', 'None')}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('cropDetection.confidence', 'Confidence')}
                        </Typography>
                        <Typography variant="h6">
                          {Math.round(detectionResult.confidence * 100)}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('cropDetection.severity', 'Severity')}
                        </Typography>
                        <Chip
                          label={detectionResult.severity || t('common.none', 'None')}
                          color={getSeverityColor(detectionResult.severity)}
                          size="small"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('cropDetection.affectedArea', 'Affected Area')}
                        </Typography>
                        <Typography variant="h6">
                          {detectionResult.affected_area_percentage}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Treatment Recommendations */}
                {detectionResult.treatments && detectionResult.treatments.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      <LocalHospital sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {t('cropDetection.treatments', 'Treatment Recommendations')}
                    </Typography>
                    <List>
                      {detectionResult.treatments.map((treatment, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <LocalHospital color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={treatment.name}
                            secondary={treatment.description}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Fertilizer Recommendations */}
                {detectionResult.fertilizer_recommendations && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      <Agriculture sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {t('cropDetection.fertilizers', 'Fertilizer Recommendations')}
                    </Typography>
                    <List>
                      {detectionResult.fertilizer_recommendations.map((fertilizer, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Agriculture color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={fertilizer.name}
                            secondary={fertilizer.application_method}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Camera Modal */}
      {showCamera && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
          }}
        >
          <Paper sx={{ p: 3, maxWidth: 500 }}>
            <Typography variant="h6" gutterBottom>
              {t('cropDetection.capturePhoto', 'Capture Photo')}
            </Typography>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
              videoConstraints={{
                facingMode: { ideal: "environment" } // Use back camera on mobile
              }}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="contained" onClick={capturePhoto} fullWidth>
                {t('cropDetection.capture', 'Capture')}
              </Button>
              <Button variant="outlined" onClick={() => setShowCamera(false)} fullWidth>
                {t('common.cancel', 'Cancel')}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default CropDetection;