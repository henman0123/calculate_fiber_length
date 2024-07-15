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
    let startCoordinatesInput = document.getElementById('start').value.trim();
    let endCoordinatesInput = document.getElementById('end').value.trim();

    let startLines = startCoordinatesInput.split('\n');
    let endLines = endCoordinatesInput.split('\n');
    
    if (startLines.length !== endLines.length) {
        document.getElementById('result').innerText = "起點和終點的行數不匹配，請檢查輸入。";
        return;
    }

    let results = [];

    for (let i = 0; i < startLines.length; i++) {
        try {
            let [x1, y1, z1] = parseCoordinate(startLines[i]);
            let [x2, y2, z2] = parseCoordinate(endLines[i]);
            let length = calculateFiberLength(x1, y1, z1, x2, y2, z2);
            results.push(`從 ${startLines[i]} 到 ${endLines[i]} 的光纖線長度是: ${length} 公尺`);
        } catch (error) {
            results.push(`輸入格式錯誤：${startLines[i]} 或 ${endLines[i]}`);
        }
    }

    document.getElementById('result').innerHTML = results.join('<br>');
}
