let dividers = [];
function addDividers() {
    if (!select_info.ok) return;
    fixSelect();
    let [startRow, startCol] = select_info.start;
    let [endRow, endCol] = select_info.end;
    dividers.push({ row: startRow, col: startCol - 1 });
    dividers.push({ row: endRow, col: endCol });
    dividers.sort((a, b) => (a.row - b.row) || (a.col - b.col));
}
function removeDividers() {
    if (!select_info.ok) return;
    fixSelect();
    let [startRow, startCol] = select_info.start;
    let [endRow, endCol] = select_info.end;
    let status = false;
    for (let i in dividers) {
        const divider = dividers[i];
        if (status) {
            if (divider.row > endRow || (divider.col > endCol && divider.row == endRow)) {
                break;
            }
        } else {
            if (divider.row < startRow || (divider.col < startCol && divider.row == startRow)) {
                continue;
            }
            status = true;
        }
        divider.s = true;
    }
    dividers = dividers.filter((d) => d.s != true);
}

function addArrangement(k) {
    if (!select_info.ok) return;
    fixSelect();
    let [startRow, startCol] = select_info.start;
    let [endRow, endCol] = select_info.end;

    for (let row = startRow; row <= endRow; row++) {
        let start = (row === startRow) ? startCol : 0;
        let end = (row === endRow) ? endCol : fumen[row].length - 1;

        for (let col = start; col <= end; col++) {
            if (fumen[row][col] == '0' || fumen[row][col] == 'J' || fumen[row][col] == 'K') {
                fumen[row] = fumen[row].slice(0, col) + k + fumen[row].slice(col + 1);
            }
        }
    }
}
function removeArrangement() {
    if (!select_info.ok) return;
    fixSelect();
    let [startRow, startCol] = select_info.start;
    let [endRow, endCol] = select_info.end;
    for (let row = startRow; row <= endRow; row++) {
        let start = (row === startRow) ? startCol : 0;
        let end = (row === endRow) ? endCol : fumen[row].length - 1;
        for (let col = start; col <= end; col++) {
            if (fumen[row][col] == 'J' || fumen[row][col] == 'K') {
                fumen[row] = fumen[row].slice(0, col) + '0' + fumen[row].slice(col + 1);
            }
        }
    }
}