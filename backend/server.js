require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const apikeys = require('./apikey.json');
const app = express();
const PORT = process.env.PORT || 5200;
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1YNQx02gPPbWcioHjdKlXt2prFrKqIHIJ';
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigin, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(fileUpload());

const SCOPE = ['https://www.googleapis.com/auth/drive'];

async function authorize() {
  const jwtClient = new google.auth.JWT(
    apikeys.client_email,
    null,
    apikeys.private_key.replace(/\\n/g, '\n'), // Ensure proper formatting
    SCOPE
  );
  await jwtClient.authorize();
  return jwtClient;
}

async function uploadFile(authClient, filePath, fileName, mimeType) { 
  return new Promise((resolve, reject) => {
    const drive = google.drive({ version: 'v3', auth: authClient });
    const fileMetaData = {
      name: fileName,
      parents: [DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: mimeType || 'application/octet-stream', // Use provided mimeType
      body: fs.createReadStream(filePath),
    };

    drive.files.create(
      {
        resource: fileMetaData,
        media: media,
        fields: 'id',
      },
      (err, file) => {
        if (err) {
          console.error('Error uploading to Google Drive:', err);
          return reject(err);
        }
        resolve(file);
      }
    );
  });
}

// Route to handle file upload
app.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      console.log('No file uploaded.');
      return res.status(400).send('No file uploaded.');
    }

    const file = req.files.file;
    const uploadDir = path.join(__dirname, 'uploads');

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
      console.log(`Created uploads directory at ${uploadDir}`);
    }

    const filePath = path.join(uploadDir, file.name);

    // Save file locally
    await file.mv(filePath);
    console.log(`File saved to ${filePath}`);

    // Upload file to Google Drive using file.mimetype
    const authClient = await authorize();
    const uploadResponse = await uploadFile(authClient, filePath, file.name, file.mimetype);
    console.log('Upload Response:', uploadResponse.data);

    res.send(`File uploaded successfully: ${uploadResponse.data.id}`);
  } catch (err) {
    console.error('Error in /upload route:', err);
    res.status(500).send(`Server Error: ${err.message}`);
  } finally {
    // Delete the file from local storage after uploading
    if (req.files && req.files.file) {
      const filePath = path.join(__dirname, 'uploads', req.files.file.name);
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
        else console.log(`File deleted: ${filePath}`);
      });
    }
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).send('Internal Server Error');
});


app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
