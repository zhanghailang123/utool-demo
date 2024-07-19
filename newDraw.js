const fs = require('fs');
const { createCanvas, loadImage, registerFont } = require('canvas');

// 可以根据需要更换字体文件路径和字体名称
registerFont('path/to/font.ttf', { family: 'Arial, sans-serif' });

const canvas = createCanvas(800, 600); // 可根据需要调整画布大小
const ctx = canvas.getContext('2d');

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

function drawText(text, filename) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000';

    wrapText(ctx, text, 50, 50, 700, 24); // 设定文本的起始位置和行高

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
}

function processFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');

    for (let i = 0; i < lines.length; i += 2) {
        if (lines[i].startsWith('Q:') && lines[i + 1].startsWith('A:')) {
            const question = lines[i].slice(3).trim();
            const answer = lines[i + 1].slice(3).trim();
            const text = `Q: ${question}\nA: ${answer}`;
            drawText(text, `output_${i / 2}.png`);
        }
    }
}

processFile('/path/to/your/data.txt');
