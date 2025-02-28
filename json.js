let fumen_lab_json;
function loadJSONFile(file) {
    file.text().then((jsonText) => {
        json = JSON.parse(jsonText);
        fumen_lab_json = json;
        loadJSON(json);
    });
}
const json_version = 'FumenLabV1';
function loadJSON(json) {
    if (json.version != json_version) {
        alert('譜面ラボJSONではありません');
        return;
    }
    if (json.fumen == undefined ||
        json.lrs == undefined || json.meta_tag == undefined || json.info == undefined || json.dividers == undefined) {
        alert('情報が欠落しています');
        return;
    }
    fumen = json.fumen;
    lrs = json.lrs;
    meta_tag = json.meta_tag;
    info = json.info;
    dividers = json.dividers;
    refreshTitleInfo();
}
function exportJSON() {
    if (!fumen) return;
    let json = {
        'version': json_version
    };
    json.fumen = fumen;
    json.lrs = lrs;
    json.meta_tag = meta_tag;
    json.info = info;
    json.dividers = dividers;
    let blob = new Blob([JSON.stringify(json)], { "type": "application/json" });
    let a = document.createElement('a');
    a.download = filename.split('.').shift() + '.fumenlab-json';
    document.body.appendChild(a);
    a.href = URL.createObjectURL(blob);
    a.click();
    a.remove();
}