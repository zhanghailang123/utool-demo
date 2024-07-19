const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

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
const upload = multer({storage: storage});

app.use(express.static('public'));
app.use(express.json({limit: '50mb'}));


// 定义getResponse函数
const getResponse = async (input) => {
    const apiKey = process.env.DASHSCOPE_API_KEY;
    const baseUrl = process.env.BASE_URL;

    try {
        const response = await axios.post(
            `${baseUrl}/chat/completions`,
            {
                model: 'qwen-max',
                messages: [
                    {'role': 'system', 'content': '接下来你将作为一个prompt优化器，优化器的作用是将我输入的文本input转化为stable diffusion v3 生成图片所需要的prompt，你需要拓展并优化我输入的文本，能被stable diffusion理解，' +
                            '；我输入的文本格式是Q A问答的形式，Q是代表问题，A是代表answer，你需要结合各种知识，理解QA问答的内容在讲些什么，再转为 stable diffusion v3 的prompt；' +
                            '规则：你只需要输出prompt即可'},
                    {'role': 'user', 'content': input}
                ],
                temperature: 0.8,
                top_p: 0.8
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching response:', error);
    }
};

const getChatResponse = async (userInput) => {
    // messages.push({ role: 'user', content: userInput });

    const completion = await getResponse(userInput);
    const assistantOutput = completion.choices[0].message.content;
    return {
        userInput: userInput,
        assistantOutput: assistantOutput
    };
};

app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully.');
});

app.post('/save-image', (req, res) => {
    const base64Data = req.body.imageData.replace('data:image/jpeg;base64,', '');
    const filePath = path.join(__dirname, 'uploads', `${Date.now()}.jpeg`);

    fs.writeFile(filePath, base64Data, 'base64', function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send('Error saving image');
        }
        res.send('Image saved successfully.');
    });
});

app.post('/prompt', async (req, res) => {
    const userInput = req.body.prompt;

    try {
        const chatResponse = await getChatResponse(userInput);
        console.log(chatResponse)
        res.json(chatResponse);
    } catch (error) {
        console.error('Error getting chat response:', error);
        res.status(500).send('Error getting chat response');
    }
});
// 定义一个初始调用函数
const initialCall = async () => {
    try {
        const userInput = '接下来你将作为一个prompt优化器，优化器的作用是将我输入的文本转化为stable diffusion v3 生成图片所需要的prompt，你需要拓展并优化我输入的文本，能被stable diffusion理解，' +
            '；我输入的文本格式是QA问答的形式，Q是代表问题，A是代表answer，你需要结合各种知识，理解QA问答的内容在讲些什么，再转为 stable diffusion v3 的prompt，规则：如果不是QA方式的提问，请你拒绝回答问题';
        const chatResponse = await getChatResponse(userInput);
        console.log('Initial call response:', chatResponse);
    } catch (error) {
        console.error('Error during initial call:', error);
    }
};

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});