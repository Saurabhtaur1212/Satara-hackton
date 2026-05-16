# AgriSaathi Setup Guide

## Prerequisites

- Python 3.11+
- Node.js 18+
- MongoDB 6.0+
- Redis 7+
- Docker & Docker Compose (optional)

## Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AgriSaathi
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Manual Setup

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

5. **Start MongoDB and Redis**
   ```bash
   # MongoDB
   mongod --dbpath /path/to/data/db
   
   # Redis
   redis-server
   ```

6. **Run the backend**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start the frontend**
   ```bash
   npm start
   ```

## Configuration

### Environment Variables

#### Backend (.env)
```env
MONGODB_URL=mongodb://localhost:27017/agrisaathi
REDIS_URL=redis://localhost:6379
JWT_SECRET_KEY=your-secret-key
OPENWEATHER_API_KEY=your-api-key
GOOGLE_MAPS_API_KEY=your-api-key
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your-api-key
```

### API Keys Required

1. **OpenWeather API** - For weather data
   - Sign up at: https://openweathermap.org/api
   
2. **Google Maps API** - For location services
   - Get key from: https://developers.google.com/maps
   
3. **Google Translate API** - For multi-language support
   - Enable at: https://cloud.google.com/translate
   
4. **Hugging Face API** - For AI models
   - Get token from: https://huggingface.co/settings/tokens

## Features Setup

### 1. AI Crop Disease Detection

- Place trained models in `ai-models/` directory
- Supported formats: TensorFlow (.h5), PyTorch (.pt)
- Update model paths in `services/ai_service.py`

### 2. Multi-language Support

- Languages supported: Hindi, English, Bengali, Telugu, Tamil, Gujarati, Marathi, Kannada, Malayalam, Punjabi, Odia, Assamese
- Translation files in `frontend/src/locales/`

### 3. Offline Support

- Service Worker configured for PWA
- Critical data cached locally
- Offline-first approach for essential features

### 4. Voice Support

- Uses Web Speech API
- Supports Hindi and English voice commands
- Text-to-speech for responses

## Database Setup

### MongoDB Collections

```javascript
// Users collection
{
  _id: ObjectId,
  name: String,
  phone: String,
  email: String,
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  farming_profile: {
    crops: [String],
    land_size: Number,
    farming_type: String
  },
  created_at: Date
}

// Crop detections collection
{
  _id: ObjectId,
  user_id: ObjectId,
  image_url: String,
  detection_result: Object,
  created_at: Date
}

// Chat history collection
{
  _id: ObjectId,
  user_id: ObjectId,
  messages: [Object],
  created_at: Date
}
```

## Deployment

### Production Deployment

1. **Update environment variables for production**
2. **Build frontend for production**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Cloud Deployment Options

- **AWS**: Use ECS, RDS, ElastiCache
- **Google Cloud**: Use Cloud Run, Cloud SQL, Memorystore
- **Azure**: Use Container Instances, CosmosDB, Redis Cache

## Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Monitoring & Logging

- Application logs in `backend/logs/`
- Health check endpoints available
- Metrics collection with Prometheus (optional)

## Security

- JWT authentication
- Rate limiting implemented
- Input validation and sanitization
- CORS configuration
- HTTPS in production

## Performance Optimization

- Redis caching for API responses
- Image compression for uploads
- Lazy loading for frontend components
- Database indexing for queries

## Troubleshooting

### Common Issues

1. **MongoDB connection error**
   - Check if MongoDB is running
   - Verify connection string in .env

2. **Redis connection error**
   - Ensure Redis server is started
   - Check Redis URL configuration

3. **AI model loading error**
   - Verify model files exist in ai-models/
   - Check file permissions

4. **API key errors**
   - Validate all API keys in .env
   - Check API quotas and limits

## Support

For issues and questions:
- Create GitHub issues
- Check documentation in `docs/` folder
- Review API documentation at `/docs` endpoint

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

This project is licensed under the MIT License.