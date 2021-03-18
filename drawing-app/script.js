const formEl = document.forms["options-form"];
const MIME_TYPE = "image/png";

var canvasEl = document.getElementById("canvas");
console.log(window);
if (window.innerWidth > 500) {
    canvasEl.width = 500;
    canvasEl.height = 500;
} else {
    canvasEl.width = 300;
    canvasEl.height =  300;
}
var context = canvasEl.getContext("2d");
var rect = canvas.getBoundingClientRect();
let drawing = false;
let oldPosX = -1;
let oldPosY = -1;

let color = formEl[0].value;
let cursorWidth = formEl[1].value;

formEl.addEventListener("submit", setOptions);
formEl.addEventListener("reset", resetCanvas);

formEl[4].addEventListener("click", download);

function download() {
    let imgBase64 = canvasEl.toDataURL();
    let imgURL = "data:image/" + imgBase64;
    let dlLink = document.createElement('a');
    dlLink.download = 'drawing.png';
    dlLink.href = imgURL;
    dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
}

function setOptions(e) {
    e.preventDefault();
    color = formEl[0].value;
    cursorWidth = formEl[1].value;
}

function resetCanvas() {
    color = "#000000";
    cursorWidth = 1;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}


canvasEl.addEventListener('mousedown', () => {
    drawing = true;
});

canvasEl.addEventListener('mouseup', () => {
    drawing = false;
    oldPosX = -1;
    oldPosY = -1;  
});

canvasEl.addEventListener('mouseleave', () => {
    drawing = false;
    oldPosX = -1;
    oldPosY = -1;  
});

canvasEl.addEventListener('mousemove', (evt)=> {
    setInterval(draw(evt), 10);
    // draw(evt);
});

function draw(evt) {
    if(drawing) {
        // context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        let pos = getMousePos(canvas, evt);
        context.beginPath();
        context.strokeStyle = color;
        context.lineJoin = "round";
        context.lineWidth = cursorWidth;
        context.lineCap ="round";
        // context.fillStyle = colorEl.value;
        // context.fillRect (pos.x, pos.y, 0.1, 0.1);
        // context.beginPath();
        // context.arc(pos.x, pos.y, 0.1, 0, 2 * Math.PI);
        context.fill();
        // context.stroke();
        // context.moveTo(0, 0);
        // context.lineTo(200, 100);
        // context.stroke();
        if(oldPosX == -1 || oldPosY == -1) {
            context.moveTo(pos.x, pos.y);
        } else {
            context.moveTo(oldPosX, oldPosY);
        }
        context.lineTo(pos.x, pos.y);
        context.fillRect(pos.x, pos.y, 0.1, 0.1);
        context.stroke();
        context.closePath();
        oldPosX = pos.x;
        oldPosY = pos.y; 
    }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}