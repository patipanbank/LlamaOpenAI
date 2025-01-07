import { ChangeEvent } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  loading: boolean;
}

const FileUpload = ({ onFileUpload, loading }: FileUploadProps) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <input
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
        id="file-upload"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <Button
          component="span"
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          disabled={loading}
        >
          Upload Excel File
        </Button>
      </label>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Supported formats: .xlsx, .xls
      </Typography>
    </Box>
  );
};

export default FileUpload; 