let tjaText, meta_tag, fumen, info, lrs, filename;
function loadFile() {
    const elem = document.getElementById('file');
    if (elem.files.length != 1) {
        alert('ファイルを一つ指定してください');
    }
    let temp_spl = elem.files[0].name.split('.');
    filename = elem.files[0].name;
    let temp_fir = temp_spl.pop();
    if (temp_fir !== 'tja' && temp_fir !== 'fumenlab-json') {
        alert('TJAまたは譜面ラボJSONファイルではありません');
        return;
    }
    if (temp_fir == 'fumenlab-json') {
        loadJSONFile(elem.files[0]);
        return;
    }
    elem.files[0].text().then(function (text) {
        tjaText = text;
        parseTja();
    });
}
let course_match = ["ONI", "3"];
function parseTja() {
    const lines = tjaText.split('\n');
    let started = false;
    meta_tag = {};
    fumen = [];
    info = [];
    lrs = [];
    let temp = '';
    let temp_info = [];
    let isCourseMatch = false;
    for (let i in lines) {
        const line = lines[i].replace('\r', '');
        if (started) {
            if (line == '#END') { started = false; continue; }
            if (line[0] == '#') {
                let info = line;
                let t_sp = line.split(' ');
                let key = t_sp[0];
                let value = null;
                if (t_sp.length >= 2) value = t_sp[1];
                switch (key) {
                    case '#BPMCHANGE':
                        info = 'BPM' + value;
                        break;
                    case '#SCROLL':
                        info = 'HS' + value;
                        break;
                    case '#MEASURE':
                        info = 'MS' + value;
                        break;
                    case '#GOGOSTART':
                        info = 'GBEG';
                        break;
                    case '#GOGOEND':
                        info = 'GEND'
                        break;
                    case '#BMSCROLL':
                        info = 'S:BM';
                        break;
                    case '#HBSCROLL':
                        info = 'S:HB';
                        break;
                    case '#DELAY':
                        info = 'DL' + value;
                        break;
                    case '#BARLINEOFF':
                        info = 'BL:X'
                        break;
                    case '#BARLINEON':
                        info = 'BL:O';
                        break;
                    default:
                        break;
                }
                temp_info.push({ "line": info, "time": 0, "s": fumen.length, "c": temp.length });
                continue;
            }
            if (isCourseMatch)
                for (let j = 0; j < line.length; j++) {
                    const c = line[j];
                    if (c == ',') {
                        fumen.push(temp);
                        for (k in temp_info) {
                            temp_info[k].time = temp_info[k].s + temp_info[k].c / temp.length;
                            if (temp.length == 0) temp_info[k].time = temp_info[k].s;
                            info.push(temp_info[k]);
                        }
                        temp_info = [];
                        lrs.push(new Array(temp.length).fill(0));
                        temp = '';
                        continue;
                    } else {
                        temp += c;
                    }
                }
        } else {
            if (line == '#START') { started = true; continue; }
            let idx = line.indexOf(':');
            let key = line.substring(0, idx);
            let value = line.substring(idx + 1, line.length);
            meta_tag[key] = value;
            if (key.toUpperCase() == 'COURSE') {
                isCourseMatch = course_match.indexOf(value.toUpperCase()) != -1;
            }
        }
    }
    if (fumen.length == 0) fumen = undefined;
    refreshTitleInfo();
}
function refreshTitleInfo() {
    document.getElementById('info').innerHTML =
        '<b>' + meta_tag.TITLE + '</b> BPM' + meta_tag.BPM;
}