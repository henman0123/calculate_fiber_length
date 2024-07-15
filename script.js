function letterToNumber(letter) {
    // 將字母轉換為數字（A=0, B=1, C=2, ...）
    return letter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
}

function zToHeight(z) {
    // 根據 Z 值計算實際高度（米）
    return 2.7 - (z - 1) * (2.7 - 0.3) / (10 - 1);
}

function calculateFiberLength(x1, y1, z1, x2, y2, z2) {
    // 將 X 座標的字母轉換為數字
    x1 = letterToNumber(x1);
    x2 = letterToNumber(x2);

    // 計算 X 和 Y 座標的距離
    let xyLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    // 計算 Z 座標的實際高度
    let z1Height = zToHeight(z1);
    let z2Height = zToHeight(z2);

    // 計算 Z 座標的總高度
    let zLength = z1Height + z2Height;

    // 計算總長度，並加上補正值 0.6
    let totalLength = xyLength + zLength + 0.6;

    // 向上取整
    return Math.ceil(totalLength);
}

function parseCoordinate(coordinate) {
    // 解析使用者輸入的座標字串，格式為 'X-Y-Z'
    let parts = coordinate.split('-');
    let x = parts[0];
    let y = parseInt(parts[1]);
    let z = parseInt(parts[2]);
    return [x, y, z];
}

function calculateLengths() {
    let coordinatesInput = document.getElementById('coordinates').value;
    let lines = coordinatesInput.trim().split('\n');
    let results = [];

    for (let i = 0; i < lines.length; i += 2) {
        if (i + 1 < lines.length) {
            try {
                let [x1, y1, z1] = parseCoordinate(lines[i]);
                let [x2, y2, z2] = parseCoordinate(lines[i + 1]);
                let length = calculateFiberLength(x1, y1, z1, x2, y2, z2);
                results.push(`從 ${lines[i]} 到 ${lines[i + 1]} 的光纖線長度是: ${length} 公尺`);
            } catch (error) {
                results.push(`輸入格式錯誤：${lines[i]} 或 ${lines[i + 1]}`);
            }
        } else {
            results.push(`單獨的輸入：${lines[i]}`);
        }
    }

    document.getElementById('result').innerHTML = results.join('<br>');
}
