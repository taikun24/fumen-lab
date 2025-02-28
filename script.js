let canvas, ctx, canvas_holder;
function resizeCanvas() {
    canvas.width = canvas_holder.offsetWidth;
    canvas.height = canvas_holder.offsetHeight;
    repaint();
}
let mouseState = false;
window.onload = function () {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas_holder = document.getElementById('canvas-holder');
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    repaint();
    document.getElementById('file').addEventListener('change', loadFile);
    animation();
    document.addEventListener('keydown', (e) => {
        if (fumen === undefined) return;
        if (e.key == 'ArrowRight' && current <= fumen.length) { scroll(1); }
        if (e.key == 'ArrowLeft' && current >= -1) scroll(-1);
        if (e.key == 'ArrowUp') sizeMeasure += 20;
        if (e.key == 'ArrowDown' && sizeMeasure != 20) sizeMeasure -= 20;
    });
    document.getElementById('diff-sel').addEventListener('change', (e) => {
        if (!tjaText) return;
        course_match = {
            "easy": ["EASY", "0"],
            "normal": ["NORMAL", "1"],
            "hard": ["HARD", "2"],
            "oni": ["ONI", "3"],
            "ura": ["URA", "EDIT", "4"]
        }[e.target.value];
        parseTja();
    })
    const getOffset = (event) => {
        const rect = event.target.getBoundingClientRect();
        const touch = event.changedTouches[0];
        return {
            offsetX: touch.pageX - rect.left,
            offsetY: touch.pageY - rect.top
        }
    };
    canvas.addEventListener('pointermove', controllMouse);
    canvas.addEventListener('pointerup', mouseUp);
    canvas.addEventListener('pointerdown', mouseDown);
    canvas.addEventListener('touchmove', (event) => controllMouse(getOffset(event)), { 'passive': true });
    canvas.addEventListener('touchend', (event) => mouseUp(getOffset(event)), { 'passive': true });
}