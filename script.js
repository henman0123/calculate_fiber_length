function letterToNumber(letter) {
    return letter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
}

function zToHeightStandard(z) {
    return 2.7 - (z - 1) * (2.7 - 0.3) / (10 - 1); //2F 機房 z 值轉換實際高度值
}

function zToHeightCustom1(z) {
    return z * 0.3;  // 1F 機房 z 值轉換實際高度值
}

function getZHeightFunction(floor) {
    switch (floor) {
        case 'custom1':
            return zToHeightCustom1;
        case 'standard':
        default:
            return zToHeightStandard;
    }
}

function calculateFiberLengthStandard(x1, y1, z1, x2, y2, z2) {
    x1 = letterToNumber(x1);
    x2 = letterToNumber(x2);

    let xyLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    let zToHeight = getZHeightFunction('standard');
    let z1Height = zToHeight(z1);
    let z2Height = zToHeight(z2);

    let zLength = z1Height + z2Height;

    let totalLength = xyLength + zLength + 0.6; //補正值 0.6 米

    return Math.ceil(totalLength);
}

function calculateFiberLengthCustom1(x1, y1, z1, x2, y2, z2) {
    x1 = letterToNumber(x1);
    x2 = letterToNumber(x2);

    let xyLength = Math.abs(y1 - y2) * 0.6;  //只根據 y1、y2 值差值計算橫向距離

    let zToHeight = getZHeightFunction('custom1');
    let z1Height = zToHeight(z1);
    let z2Height = zToHeight(z2);

    let zLength = z1Height + z2Height;

    let totalLength = xyLength + zLength + 1.6; //補正值 1.6 米(補正值為 0.6 米 + 1 米為含 OPEN RACK 上線槽的空間)

    return Math.ceil(totalLength);
}

function getFiberLengthFunction(floor) {
    switch (floor) {
        case 'custom1':
            return calculateFiberLengthCustom1;
        case 'standard':
        default:
            return calculateFiberLengthStandard;
    }
}

function parseCoordinate(coordinate) {
    let parts = coordinate.split('-');
    let xy = parts[0]; //提取 split 後的首個部分，例如：Y20-5，取出 Y20。
    let x = xy.charAt(0); //讓 x = split 後的第一部分的首個字元，例如：Y20，取出 Y，
    let y = xy.slice(1); //刪除 x = split 後的第一個字元並取出，例如：Y20，刪除 Y，取出 20，
    let z = parts[1]; //提取 split 後的第二部分，例如：Y20-5，取出 5 。
    return [x, y, z];
}

function calculateLengths() {
    let startCoordinatesInput = document.getElementById('start').value.trim();
    let endCoordinatesInput = document.getElementById('end').value.trim();
    let floor = document.getElementById('floor').value;

    let startLines = startCoordinatesInput.split('\n');
    let endLines = endCoordinatesInput.split('\n');
    
    if (startLines.length !== endLines.length) {
        document.getElementById('result').innerText = "起點和終點的行數不匹配，請檢查輸入。";
        document.getElementById('result').style.display = 'block';
        return;
    }

    let results = [];
    let calculateFiberLength = getFiberLengthFunction(floor);

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
    document.getElementById('result').style.display = 'block';
}
