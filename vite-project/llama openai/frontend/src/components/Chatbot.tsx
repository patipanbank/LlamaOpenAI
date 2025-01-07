import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

interface Message {
  text: string;
  isUser: boolean;
}

function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    // เพิ่มข้อความของผู้ใช้
    const userMessage: Message = {
      text: input,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // จำลองการตอบกลับจาก AI (สามารถเปลี่ยนเป็น API call จริงได้)
    const botMessage: Message = {
      text: 'This is a sample response. Replace with actual API call.',
      isUser: false
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        AI Chatbot
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ 
          flex: 1, 
          mb: 2, 
          p: 2, 
          maxHeight: '60vh', 
          overflow: 'auto'
        }}
      >
        <List>
          {messages.map((message, index) => (
            <ListItem 
              key={index}
              sx={{
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
              }}
            >
              <Paper 
                elevation={1}
                sx={{
                  p: 1,
                  backgroundColor: message.isUser ? '#e3f2fd' : '#f5f5f5',
                  maxWidth: '70%'
                }}
              >
                <ListItemText primary={message.text} />
              </Paper>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="พิมพ์ข้อความของคุณ..."
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#ffffff',
              '&:hover': {
                backgroundColor: '#fafafa',
              },
              '&.Mui-focused': {
                backgroundColor: '#ffffff',
              }
            },
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        />
        <Button 
          variant="contained" 
          onClick={handleSend}
          sx={{
            minWidth: '100px',
            height: '56px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }
          }}
        >
          ส่ง
        </Button>
      </Box>
    </Box>
  );
}

export default Chatbot; 