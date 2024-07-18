const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // 引入cors

const app = express();
const port = 3000;

// 全局使用 CORS 中间件，允许所有跨域请求
app.use(cors());

// 设置multer来处理文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));

app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully.');
});

app.post('/save-image', (req, res) => {
    const base64Data = req.body.imageData.replace('data:image/jpeg;base64,','');
    const filePath = path.join(__dirname, 'uploads', `${Date.now()}.jpeg`);

    fs.writeFile(filePath, base64Data, 'base64', function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send('Error saving image');
        }
        res.send('Image saved successfully.');
    });
});

app.post('/prompt', (req, res) => {
    const base64Data = req.body.imageData.replace('data:image/jpeg;base64,','');
    const filePath = path.join(__dirname, 'uploads', `${Date.now()}.jpeg`);

    fs.writeFile(filePath, base64Data, 'base64', function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send('Error saving image');
        }
        res.send('Image saved successfully.');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});