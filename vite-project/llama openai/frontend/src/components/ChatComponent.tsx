import { useState, useEffect } from 'react';
import { askLlama } from '../services/api';
import { Box, TextField, Typography, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ChatMessage {
  type: 'user' | 'assistant';
  content: string;
}

export default function ChatComponent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

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
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    
    // Add user message immediately
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);

    try {
      const response = await askLlama(userMessage);
      // Add AI response
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: response.answer || response 
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: 'Error getting response from AI'
      }]);
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
      right: 0,
      bottom: 0
    }}>
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        width: '100%',
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

              {/* ข้อความ */}
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
            </Box>
          </Box>
        ))}
      </Box>

      {/* Input section */}
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
          />
          <IconButton
            onClick={handleSend}
            sx={{
              position: 'absolute',
              right: 8,
              bottom: 8,
              color: 'rgba(255,255,255,0.5)',
              '&:hover': {
                color: 'rgba(255,255,255,0.8)'
              }
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
} 