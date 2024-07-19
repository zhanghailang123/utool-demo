// const axios = require('axios');
// require('dotenv').config();
//
// const getResponse = async (messages) => {
//     const apiKey = process.env.DASHSCOPE_API_KEY;
//     const baseUrl = process.env.BASE_URL;
//
//     try {
//         const response = await axios.post(
//             `${baseUrl}/chat/completions`,
//             {
//                 model: 'qwen-turbo',
//                 messages: messages,
//                 temperature: 0.8,
//                 top_p: 0.8
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${apiKey}`,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );
//
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching response:', error);
//     }
// };
//
// const getChatResponse = async (userInput) => {
//     let messages = [{ role: 'system', content: 'You are a helpful assistant.' }];
//     messages.push({ role: 'user', content: userInput });
//
//     const completion = await getResponse(messages);
//     const assistantOutput = completion.choices[0].message.content;
//
//     return {
//         userInput: userInput,
//         assistantOutput: assistantOutput
//     };
// };
//
// module.exports = {
//     getChatResponse
// };