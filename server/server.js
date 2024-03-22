const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const Content = require('./models/Content');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

app.post('/submit', upload.single('file'), async (req, res) => {
    try {
        const { text, roomId, accessCode } = req.body;
        const file = req.file;

        const exist = await Content.findOne({ roomId });

        if (exist) {
          return res.status(400).json({ message: "Room already exists!" });

        }


        const newContent = new Content({
            text,
            fileName: file ? file.originalname : undefined,
            fileSize: file ? file.size : undefined,
            roomId,
            accessCode
        });

        await newContent.save();

        console.log('Получены данные:', { text, roomId, accessCode });

        res.status(200).json({ id: newContent._id });
    } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
        res.status(500).json({ message: 'Произошла ошибка' });
    }
});

app.get('/files/:id', async (req, res) => {
    try {
      const contentId = req.params.id;
      const content = await Content.findById(contentId);
  
      if (!content) {
        return res.status(404).json({ message: 'Контент не найден' });
      }
  
      function formatFileSize(bytes) {
        let size = bytes;
        let unit = 'B';
    
        switch (true) {
            case bytes < 1024:
                break;
            case bytes < 1024 * 1024:
                size = (bytes / 1024).toFixed(2);
                unit = 'KB';
                break;
            case bytes < 1024 * 1024 * 1024:
                size = (bytes / (1024 * 1024)).toFixed(2);
                unit = 'MB';
                break;
            case bytes < 1024 * 1024 * 1024 * 1024:
                size = (bytes / (1024 * 1024 * 1024)).toFixed(2);
                unit = 'GB';
                break;
            default:
                size = 'Too large';
                unit = '';
        }
    
        return `${size} ${unit}`;
    }

    let fileSizeFormatted = '0B';
      
      if (content.fileName) {
        fileSizeFormatted = formatFileSize(content.fileSize); 
      }

    
      res.status(200).json({
        text: content.text,
        fileName: content.fileName,
        fileSize: fileSizeFormatted,
        roomId : content.roomId,
        accessCode: content.accessCode
      });
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      res.status(500).json({ message: 'Произошла ошибка' });
    }
  });
  
  app.get('/download/:id', async (req, res) => {
    try {
      const contentId = req.params.id;
      const content = await Content.findById(contentId);
  
      if (!content || !content.fileName) {
        return res.status(404).json({ message: 'Файл не найден' });
      }
  
      const filePath = path.join(__dirname, 'uploads', content.fileName);
      res.sendFile(filePath);
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
      res.status(500).json({ message: 'Произошла ошибка' });
    }
  });
  
  app.post('/getRoom', async (req, res) => {
    try {
        const { roomId, accessCode } = req.body;

        if (!roomId) {
            return res.status(400).json({ message: 'Missing roomId' });
        }

        const content = await Content.findOne({ roomId });

        if (!content) {
            return res.status(404).json({ message: 'Room not found' });
        }

        if(content.accessCode && !accessCode){
          return res.status(400).json({ message: 'Room with password' });
        }

        if(content.accessCode){
            if(accessCode != content.accessCode){
              return res.status(400).json({ message: 'Password if false' });
            }
        }
        res.status(200).json({ id: content._id });
    } catch (error) {
        console.error('Error while fetching data:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

const start = async () => {
    try {
        await mongoose.connect("mongodb+srv://Pyth0nHater:123123123@shared-clipboard.kr0um3d.mongodb.net/?retryWrites=true&w=majority")

        app.listen(PORT, () => {
            console.log(`Server start!\nhttp://localhost:${PORT}`);
        });
    } catch (err) {
        console.log("Error: ", err);
        process.exit(1);
    }
}

start();
