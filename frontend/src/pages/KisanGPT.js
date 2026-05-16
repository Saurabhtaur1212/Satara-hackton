import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  Avatar,
  Chip,
  IconButton,
  Card,
  CardContent,
  Grid,
  Fab,
} from '@mui/material';
import {
  Send,
  Mic,
  MicOff,
  SmartToy,
  Person,
  Agriculture,
  WbSunny,
  AttachMoney,
  School,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { kisanGPTService } from '../services/api';

const KisanGPT = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: t('kisanGPT.welcome', 'नमस्ते! मैं KisanGPT हूं। मैं आपकी खेती में मदद कर सकता हूं। आप मुझसे फसल, मौसम, बाजार की कीमतें, या सरकारी योजनाओं के बारे में पूछ सकते हैं।'),
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const quickQuestions = [
    {
      icon: <Agriculture />,
      text: t('kisanGPT.quickQuestions.crops', 'मेरी फसल की देखभाल कैसे करूं?'),
      category: 'crops'
    },
    {
      icon: <WbSunny />,
      text: t('kisanGPT.quickQuestions.weather', 'आज का मौसम कैसा है?'),
      category: 'weather'
    },
    {
      icon: <AttachMoney />,
      text: t('kisanGPT.quickQuestions.prices', 'आज की बाजार दरें क्या हैं?'),
      category: 'prices'
    },
    {
      icon: <School />,
      text: t('kisanGPT.quickQuestions.schemes', 'कौन सी सरकारी योजनाएं हैं?'),
      category: 'schemes'
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (transcript) {
      setInputMessage(transcript);
    }
  }, [transcript]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await kisanGPTService.sendMessage({
        message: messageText,
        language: localStorage.getItem('language') || 'hi',
        context: {
          previous_messages: messages.slice(-5) // Send last 5 messages for context
        }
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.response,
        suggestions: response.suggestions,
        relatedTopics: response.related_topics,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: t('kisanGPT.error', 'माफ करें, कुछ गलत हुआ है। कृपया फिर से कोशिश करें।'),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (browserSupportsSpeechRecognition) {
      if (listening) {
        SpeechRecognition.stopListening();
        setIsListening(false);
      } else {
        resetTranscript();
        SpeechRecognition.startListening({
          continuous: true,
          language: localStorage.getItem('language') === 'hi' ? 'hi-IN' : 'en-IN'
        });
        setIsListening(true);
      }
    }
  };

  const handleQuickQuestion = (question) => {
    sendMessage(question.text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        🤖 KisanGPT - {t('kisanGPT.title', 'आपका AI खेती सहायक')}
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Questions */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              {t('kisanGPT.quickQuestions.title', 'त्वरित प्रश्न')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {quickQuestions.map((question, index) => (
                <Card
                  key={index}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => handleQuickQuestion(question)}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {question.icon}
                      <Typography variant="body2">
                        {question.text}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Chat Interface */}
        <Grid item xs={12} md={9}>
          <Paper elevation={3} sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            {/* Messages */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <List>
                {messages.map((message) => (
                  <ListItem
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
                        alignItems: 'flex-start',
                        gap: 1,
                        maxWidth: '80%',
                      }}
                    >
                      <Avatar sx={{ bgcolor: message.type === 'user' ? 'primary.main' : 'secondary.main' }}>
                        {message.type === 'user' ? <Person /> : <SmartToy />}
                      </Avatar>
                      <Box>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            bgcolor: message.type === 'user' ? 'primary.light' : 'grey.100',
                            color: message.type === 'user' ? 'white' : 'text.primary',
                          }}
                        >
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                            {message.content}
                          </Typography>
                        </Paper>
                        
                        {/* Suggestions */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {message.suggestions.map((suggestion, index) => (
                              <Chip
                                key={index}
                                label={suggestion}
                                size="small"
                                onClick={() => sendMessage(suggestion)}
                                sx={{ cursor: 'pointer' }}
                              />
                            ))}
                          </Box>
                        )}
                        
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          {message.timestamp.toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
                {loading && (
                  <ListItem sx={{ justifyContent: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        <SmartToy />
                      </Avatar>
                      <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.100' }}>
                        <Typography variant="body1">
                          {t('kisanGPT.typing', 'टाइप कर रहा है...')}
                        </Typography>
                      </Paper>
                    </Box>
                  </ListItem>
                )}
              </List>
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('kisanGPT.placeholder', 'अपना प्रश्न यहाँ लिखें...')}
                  disabled={loading}
                />
                
                {browserSupportsSpeechRecognition && (
                  <IconButton
                    color={isListening ? 'secondary' : 'default'}
                    onClick={handleVoiceInput}
                    disabled={loading}
                  >
                    {listening ? <MicOff /> : <Mic />}
                  </IconButton>
                )}
                
                <Button
                  variant="contained"
                  onClick={() => sendMessage()}
                  disabled={loading || !inputMessage.trim()}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  <Send />
                </Button>
              </Box>
              
              {listening && (
                <Typography variant="caption" color="secondary" sx={{ mt: 1, display: 'block' }}>
                  {t('kisanGPT.listening', 'सुन रहा है... बोलना बंद करने के लिए माइक बटन दबाएं')}
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default KisanGPT;