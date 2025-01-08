import { useState, useEffect, useRef } from 'react';
import { askLlama } from '../services/api';
import { Box, TextField, Typography, IconButton, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ChatMessage {
  type: 'user' | 'assistant';
  content: string;
  loading?: boolean;
}

export default function ChatComponent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const getWelcomeMessage = async () => {
      try {
        const welcomeMessage = `Welcome to Grade Assistant! 👋`;
        setMessages([{ type: 'assistant', content: welcomeMessage }]);
      } catch (error) {
        console.error('Error getting welcome message:', error);
      }
    };

    getWelcomeMessage();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input;
    setInput('');
    setIsLoading(true);
    
    // Add user message immediately
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    // Add loading indicator
    setMessages(prev => [...prev, { type: 'assistant', content: '', loading: true }]);

    try {
      const response = await askLlama(userMessage);
      // Replace loading indicator with actual response
      setMessages(prev => [
        ...prev.slice(0, -1), // Remove loading indicator
        { type: 'assistant', content: response.answer || response }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev.slice(0, -1), // Remove loading indicator
        { type: 'assistant', content: 'Error getting response from AI' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ 
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#343541',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0
    }}>
      <Box sx={{ 
        flex: 1,
        overflowY: 'auto',
        paddingBottom: '100px'
      }}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              width: '100%',
              backgroundColor: msg.type === 'assistant' ? '#444654' : '#343541',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Box sx={{
              maxWidth: '800px',
              width: '100%',
              p: 3,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 3
            }}>
              {msg.loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CircularProgress size={20} sx={{ color: '#ECECF1' }} />
                  <Typography sx={{ color: '#ECECF1' }}>
                    AI is thinking...
                  </Typography>
                </Box>
              ) : (
                <Typography
                  sx={{
                    color: '#ECECF1',
                    whiteSpace: 'pre-line',
                    fontFamily: 'inherit',
                    flex: 1
                  }}
                >
                  {msg.content}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#343541',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)'
      }}>
        <Box sx={{ 
          maxWidth: '800px',
          width: '100%',
          position: 'relative'
        }}>
          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about student grades..."
            variant="outlined"
            multiline
            maxRows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#40414F',
                color: '#ECECF1',
                padding: '12px 45px 12px 12px',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.1)'
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.2)'
                }
              }
            }}
            disabled={isLoading}
          />
          <IconButton
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            sx={{
              position: 'absolute',
              right: 8,
              bottom: 8,
              color: isLoading ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)',
              '&:hover': {
                color: isLoading ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.8)'
              }
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: 'rgba(255,255,255,0.5)' }} />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
} 