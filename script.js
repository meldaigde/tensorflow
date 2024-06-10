const video = document.getElementById('video');
const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');
let ball = { x: 50, y: 430, radius: 15 }; // Start ball at the bottom left
let box = { x: 270, y: 190, width: 100, height: 100 }; // Center box, larger size

async function setupCamera() {
    video.width = 640;
    video.height = 480;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    return new Promise((resolve) => {
        video.onloadedmetadata = () => resolve(video);
    });
}

async function loadModel() {
    return handpose.load();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
}

function drawBox() {
    ctx.beginPath();
    ctx.rect(box.x, box.y, box.width, box.height);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;
    ctx.stroke();
}

async function detectHands(model) {
    const predictions = await model.estimateHands(video);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawBox();

    if (predictions.length > 0) {
        const indexFinger = predictions[0].landmarks[8]; // Index finger tip
        ball.x = indexFinger[0];
        ball.y = indexFinger[1];

       
if (
    ball.x > box.x && ball.x < box.x + box.width &&
    ball.y > box.y && ball.y < box.y + box.height
) {
    
    console.log('Ball is inside the box!');
} else {
    
    console.log('Ball is out of the box!');
}

        
        
    }

    requestAnimationFrame(() => detectHands(model));
}

async function main() {
    await setupCamera();
    video.play();
    const model = await loadModel();
    detectHands(model);
}

main();





