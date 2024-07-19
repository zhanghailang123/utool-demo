const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let testHeight = y;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
            testHeight += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
    return testHeight;
}

function drawText(textPairs) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear with black fill
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';

    let y = 30; // Initial vertical offset
    textPairs.forEach(pair => {
        y = wrapText(ctx, `Q: ${pair.question}`, 10, y + 20, canvas.width - 20, 20);
        y = wrapText(ctx, `A: ${pair.answer}`, 10, y + 20, canvas.width - 20, 20);
    });

    // Adjust canvas height based on text
    // canvas.height = y + 20;
}

function loadAndDrawText() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.split('\n');
        const textPairs = [];

        for (let i = 0; i < lines.length; i += 2) {
            if (lines[i].startsWith('Q:') && lines[i + 1] && lines[i + 1].startsWith('A:')) {
                textPairs.push({
                    question: lines[i].substring(2).trim(),
                    answer: lines[i + 1].substring(2).trim()
                });
            }
        }

        drawText(textPairs);
    };

    reader.readAsText(file);
}

function saveCanvasAsImage() {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'qa_image.png';
    link.href = dataUrl;
    link.click();
}
