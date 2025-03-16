let LRSet = 'LR@';
function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
}
let paintPrev = -1;
let paintPrevType = 0;
let balloonIndex = 0;
function paintTja(tjaLine, lrs, x, y, size, measure) {
    line(x, y - size / 5, x, y + size / 5);
    if (tjaLine.length == 0) return;
    let dist = measure / tjaLine.length;
    const fontSize = (size / 20);
    for (let i = 0; i < tjaLine.length; i++) {
        const c = tjaLine[i];
        if (c != '0') {
            drawNote(x + dist * i, y, c, size / 15);
            let txt = '';
            if (lrs[i] == 2) txt = LRSet[mainHand - 1];
            if (lrs[i] == 1) txt = LRSet[offHand - 1];
            if (lrs[i] == 3) txt = LRSet[2];
            ctx.fillStyle = 'white';
            if (c != '8') ctx.fillText(txt, x + dist * i - fontSize / 2, y + fontSize / 2);
        }
    }
}
function drawNoteCircle(x, y, color, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}
function drawNote(x, y, type, s) {
    let size = s;
    if (type == '3' || type == '4') size *= 1.5;
    let color = 'black';
    if (type == '1' || type == '3') color = 'red';
    if (type == '2' || type == '4') color = 'blue';
    if (type == '5' || type == '6') color = '#ffba00';
    if (type == '7') { color = '#fc7801'; balloonIndex++; }
    if (type == 'J') color = 'pink';
    if (type == 'K') color = 'lightblue';
    if (type == '8') {
        if (paintPrev == -1) return;
        if (paintPrevType == '5' || paintPrevType == '6') color = '#ffba00';
        if (paintPrevType == '6') size *= 1.5;
        if (paintPrevType == '7') color = '#fc7801';
        ctx.fillStyle = color;
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        // body
        ctx.beginPath();
        ctx.rect(paintPrev, y - size, (x - paintPrev), size * 2);
        ctx.closePath();
        ctx.fill();
        // tail
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        // body + tail stroke
        ctx.beginPath();
        ctx.moveTo(paintPrev, y - size);
        ctx.arc(x, y, size, Math.PI / 2 * 3, Math.PI / 2);
        ctx.lineTo(paintPrev, y + size);
        ctx.closePath();
        ctx.stroke();
        // head
        if (paintPrevType == '7') {
            ctx.beginPath();
            ctx.moveTo(paintPrev - size, y);
            ctx.arc(paintPrev + size * 3, y, size, Math.PI / 2 * 3, Math.PI / 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = 'black';
            ctx.fillText(balloon[balloonIndex] + '打', paintPrev, y - size * 2);
        }
        drawNoteCircle(paintPrev, y, color, size);
        paintPrev = -1;
        return;
    }

    if (type == '5' || type == '6' || type == '7') {
        paintPrev = x;
        paintPrevType = type;
    }
    if (x - size > canvas.width) return;
    if (x + size < 0) return;
    drawNoteCircle(x, y, color, size);

}
function animation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (time != -1) {
        let now = (new Date().getTime() - time) / duration;
        if (now >= 1) { time = -1; current = after; }
        current = (after - before) * Math.sqrt(now) + before;
    } else {
        if (current % 1 != 0) current = Math.round(current);
    }
    repaint();
    requestAnimationFrame(animation);
}
function scroll(d) {
    time = new Date().getTime();
    after += d;
    before = after - d;
    current = before;
}
const duration = 200;
let size = 300;
let sizeMeasure = 400;
let current = -1;
let before = 0;
let after = 0;
let time = -1;
const offset = 100;
function idToPos(i) {
    return (i - current) * sizeMeasure + offset;
}
function idToPosA(arr) {
    let w = arr[1] / arr[2];
    if (isNaN(w)) w = 1;
    return (arr[0] + w - current) * sizeMeasure + offset;
}
function repaint() {
    ctx.fillStyle = 'lightgray';
    ctx.font = '50px Roboto medium';
    ctx.fillRect(0, canvas.height - 200, 100, 200);
    ctx.fillRect(canvas.width - 100, canvas.height - 200, 100, 200);
    ctx.fillStyle = 'black';
    ctx.fillText('←', 25, canvas.height - 100);
    ctx.fillText('→', canvas.width - 75, canvas.height - 100);
    let mousePos = idToPos(mouseTime);
    let beginPos = idToPos(select_begin);
    ctx.fillStyle = 'pink';
    let startPos = idToPosA(select_info.start);
    let endPos = idToPosA(select_info.end);
    if (select_info.ok) ctx.fillRect(startPos, 130, endPos - startPos, 140);
    ctx.strokeStyle = 'red';
    if (select_info.ok) {
        line(startPos, 130, startPos, 270);
        line(endPos, 130, endPos, 270);
    }
    ctx.fillStyle = 'lightgreen';
    if (select_begin != -1) ctx.fillRect(beginPos, 130, mousePos - beginPos, 140);
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(mousePos - 10, 100, 20, 200);
    ctx.font = (size / 15) + 'px Roboto medium';

    // Draw dividers
    ctx.strokeStyle = 'gray';
    dividers.forEach(divider => {
        let pos = idToPosA([divider.row, divider.col + 1 / 2, fumen[divider.row].length]);
        line(pos, 150, pos, 250);
    });
    paintPrev = -1;
    balloonIndex = -1;
    for (i in fumen) {
        paintTja(fumen[i], lrs[i], idToPos(i), 200, size, sizeMeasure);
    }
    let bef = -1;
    let y = 70;
    ctx.font = (size / 20) + 'px Roboto medium';
    for (i in info) {
        ctx.fillStyle = 'black';
        let x = (info[i].time - current) * sizeMeasure + offset;
        if (info[i].time != bef) {
            y = 70;
            bef = info[i].time;
        } else {
            y += 20;
        }
        ctx.fillText(info[i].line, x, y);
    }
}