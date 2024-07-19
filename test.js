// async function refactorPrompt(prompt) {
//     const response = await fetch('http://localhost:3000/prompt', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ prompt: prompt })
//     });
//     return await response.json();
// }
//
// (async () => {
//     const data = await refactorPrompt('Q: 一个屁的推力有多大？A: @小火龙 ：我看您加的标签是「航空发动机」，但是航空发动机啊，是先吸入工质再以高速排出的发动机，但是屁呢是由肠道中的化学反应产生，属于自带推进剂，经反应后再高速排出，不依赖于外界空气，这显然是属于火箭发动机啊。再加上根据您肠道内的不同情况，可能属于固体火箭发动机、液体火箭发动机甚至是固液混合火箭发动机；根据您尾（ju）喷（hua）管形状的不同，也会产生不同的影响；根据您携带的推进剂的成分不同，排气量也不同，这问题可就复杂了。所以我建议您在标签上加上「火箭发动机」的标签，去祸祸搞航天或导弹的那帮人去。');
//     console.log('输出结果：' + data.assistantOutput);
// })();
function drawText(text) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const lineHeight = 100;
    const padding = 10;
    const maxWidth = 1000; // 设置合理的画布最大宽度

    // 设置字体以便测量文本宽度
    ctx.font = '20px Arial';

    // 处理换行
    const words = text.split('\n');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);

    const canvasWidth = maxWidth + padding * 2;
    const canvasHeight = lines.length * lineHeight + padding * 2;

    // 动态设置画布宽度和高度
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // 设置背景颜色和文本样式
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';

    // 绘制文本
    let y = padding + lineHeight;
    for (const line of lines) {
        ctx.fillText(line, padding, y);
        y += lineHeight;
    }

    //先保存一次文本图片到本地
    const finalImage = new Image();
    finalImage.src = canvas.toDataURL('image/jpeg');
    finalImage.className = 'generated-image';
    saveImage(finalImage.src); // 保存图片到服务器

    return canvas;
}
async function saveImage(imageData) {
    const response = await fetch('http://localhost:3000/save-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({imageData: imageData})
    });

    if (!response.ok) {
        alert('保存图片时出错');
    } else {
        console.log('图片保存成功');
    }
}

drawText("Q: 如何判断温泉的水是不是锅炉烧的？\n" +
    "A: @匿名用户 ：之前去过一个。门票只有两块钱，而且环境相当简陋。就是一个露天的大池子。顺便问了老板，老板原话：「肯定是天然的啊，我就收你两块钱还给你烧热水你当我傻啊。」\n")