let mouseTime = 0;
let mainHand = 1;
let offHand = 2;
function getIndex(mx) {
    let x = mx - offset;
    return parseInt(current + x / sizeMeasure);
}
function getOffset(mx, idx) {
    let x = mx - offset - (idx - current) * sizeMeasure;
    if (fumen[idx] == undefined) return 0;
    return Math.round(x / sizeMeasure * fumen[idx].length) / fumen[idx].length;
}
function getFumenPos(mx) {
    let idx = getIndex(mx);
    return idx + getOffset(mx, idx);
}
function getFumenPosArr(mx) {
    let idx = getIndex(mx);
    return [idx, getOffset(mx, idx) * fumen[idx].length, fumen[idx].length];
}
function mouseDown(e) {
    if (!fumen) return;
    if (e.offsetY > canvas.height - 200) {
        if (e.offsetX < 100) {
            scroll(-1);
            return;
        }
        if (e.offsetX > canvas.width - 100) {
            scroll(1);
            return;
        }
    }
    select_begin = getFumenPos(e.offsetX);
    if (select_begin < 0) return;
    select_info.start = getFumenPosArr(e.offsetX);
    select_info.ok = false;
}
function mouseUp(e) {
    if (!fumen) return;
    select_begin = -1;
    if (getFumenPos(e.offsetX) < 0) return;
    select_info.ok = true;
    select_info.end = getFumenPosArr(e.offsetX);
}
function controllMouse(e) {
    if (!fumen) return;
    mouseTime = getFumenPos(e.offsetX);
}
function add_info(tag, text) {
    if (meta_tag[tag] !== undefined) t_info_text += text + ':' + meta_tag[tag] + '<br>';
}
let t_info_text;
let select_begin = -1;
let select_info = { 'start': [0, 0, 0], 'end': [0, 0, 0], 'ok': false }
function info_show() {
    if (!fumen) return;
    t_info_text = '<b>INFO</b><br>';
    add_info('TITLE', 'タイトル');
    add_info('SUBTITLE', 'サブタイトル');
    add_info('BPM', 'BPM');
    add_info('WAVE', '音源ファイル名');
    add_info('OFFSET', 'オフセット');
    add_info('SONGVOL', '曲の音量');
    add_info('SEVOL', '打音の音量');
    add_info('SCOREMODE', 'スコアモード');
    add_info('GENRE', 'ジャンル');
    add_info('DEMOSTART', 'デモ音源再生位置');
    t_info_text += '<br>';
    t_info_text += '現在のコース：' + document.getElementById('diff-sel').options
    [document.getElementById('diff-sel').selectedIndex].textContent + '<br>';
    t_info_text += '譜面の長さ：' + fumen.length + '小節<br>';
    document.getElementById('info_text').innerHTML = t_info_text;
    document.getElementById('info_box').style.display = 'block';
}
function info_hide() {
    document.getElementById('info_box').style.display = 'none';
}
function setting_show() {
    document.getElementById('setting_box').style.display = 'block';
}
function setting_hide() {
    document.getElementById('setting_box').style.display = 'none';
}
function selectAll() {
    select_info.start = [0, 0, fumen[0].length];
    let l = fumen[fumen.length - 1].length;
    select_info.end = [fumen.length - 1, l, l];
    select_info.ok = true;
}
function disSelect() {
    select_info.ok = false;
}
function fixSelect() {
    let [startRow, startCol] = select_info.start;
    let [endRow, endCol] = select_info.end;
    if (startRow > endRow || (startRow === endRow && startCol > endCol)) {
        [select_info.start, select_info.end] = [select_info.end, select_info.start];
    }
}
function se(i) {
    if (!fumen) return;
    let select = [];
    fixSelect();
    let [startRow, startCol] = select_info.start;
    let [endRow, endCol, endCol2] = select_info.end;
    if (startRow === endRow) {
        for (let col = startCol; col <= endCol; col++) {
            select.push([startRow, col]);
        }
        if (endCol2 === endCol) select.push([startRow + 1, 0]);
    } else {
        for (let col = startCol; col < fumen[startRow].length; col++) {
            select.push([startRow, col]);
        }
        for (let row = startRow + 1; row < endRow; row++) {
            for (let col = 0; col < fumen[row].length; col++) {
                select.push([row, col]);
            }
        }
        for (let col = 0; col <= endCol; col++) {
            select.push([endRow, col]);
        }
    }
    const forFunc = (callBack) => {
        let index = 0;
        select.forEach(e => {
            lrs[e[0]][e[1]] = callBack(fumen[e[0]][e[1]]);
        });
    }
    let sec = false;
    switch (i) {
        case 0:
            forFunc(() => 0);
            break;
        case 1:
            forFunc(() => mainHand);
            break;
        case 2:
            forFunc(() => offHand);
            break;
        case 3:
            let bef = '0';
            sec = false;
            forFunc((f) => {
                if (bef == '0' && f != '0') {
                    sec = !sec;
                    if (sec) {
                        return mainHand;
                    } else return offHand;
                }
                bef = f;
                if (f == '0') { sec = false; return 0; }
            })
            break;
        case 4:
            sec = false;
            forFunc((f) => {
                if (f == '0') return 0;
                sec = !sec;
                if (sec) return mainHand;
                else return offHand;
            })
            break;
        case 5:
            forFunc((f) => (f == '0') ? 0 : ((f == '1' || f == '3') ? mainHand : offHand));
            break;
        case 6:
            forFunc((f) => (f == '0') ? 0 : ((f == '2' || f == '4') ? mainHand : offHand));
            break;
        case 7:
            forFunc(() => 3);
            break;
    }
}