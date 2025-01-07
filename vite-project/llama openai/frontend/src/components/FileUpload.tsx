import { ChangeEvent } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  loading: boolean;
}

export default function FileUpload({ onFileUpload, loading }: FileUploadProps) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => e.target.files && onFileUpload(e.target.files[0])}
        style={{ display: 'none' }}
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button
          component="span"
          variant="contained"
          sx={{
            backgroundColor: '#40414F',
            color: '#ECECF1',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Excel File'}
        </Button>
      </label>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Supported formats: .xlsx, .xls
      </Typography>
    </Box>
  );
} 