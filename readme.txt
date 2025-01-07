npm install @mui/material @mui/icons-material xlsx
npm install react react-dom
npm list react react-dom @mui/material @mui/icons-material

ดาวน์โหลดและติดตั้ง Ollama จาก: https://ollama.ai/
หลังจากติดตั้งแล้ว เปิด Command Prompt หรือ Terminal และรันคำสั่ง:

# ดาวน์โหลด llama2 model
ollama pull llama2

# รัน Ollama server
ollama run llama2


# รันด้วย GPU
set CUDA_VISIBLE_DEVICES=0 && ollama run llama2
# กำหนดจำนวน GPU layers ที่จะใช้
set OLLAMA_CUDA_LAUNCHES=64 && ollama run llama2

# ตั้งค่าสำหรับคอมกาก:
set OLLAMA_CUDA_LAUNCHES=16
set OLLAMA_GPU_LAYERS=16
ollama run llama2:7b-chat

#กำจัด
taskkill /F /IM ollama.exe

#เช็ค
tasklist | findstr ollama

#เปิด
ollama serve