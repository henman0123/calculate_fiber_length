function letterToNumber(letter) {
    return letter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
}

function zToHeightStandard(z) {
    return 2.7 - (z - 1) * (2.7 - 0.3) / (10 - 1); // 2F 機房 z 值轉換實際高度值
}

function zToHeightCustom1(z) {
    return z * 0.3; // 1F 機房 z 值轉換實際高度值
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

    let totalLength = xyLength + zLength + 0.6; // 補正值 0.6 米

    return Math.ceil(totalLength);
}

function calculateFiberLengthCustom1(x1, y1, z1, x2, y2, z2) {
    x1 = letterToNumber(x1);
    x2 = letterToNumber(x2);

    let xyLength = Math.abs(y1 - y2) * 0.6; // 只根據 y1、y2 值差值計算橫向距離

    let zToHeight = getZHeightFunction('custom1');
    let z1Height = zToHeight(z1);
    let z2Height = zToHeight(z2);

    let zLength = z1Height + z2Height;

    let totalLength = xyLength + zLength + 1.6; // 補正值 1.6 米 (補正值為 0.6 米 + 1 米為含 OPEN RACK 上線槽的空間)

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
    let xy = parts[0]; // 提取 split 後的首個部分，例如：Y20-5，取出 Y20。
    let x = xy.charAt(0); // 讓 x = split 後的第一部分的首個字元，例如：Y20，取出 Y
    let y = xy.slice(1); // 讓 y = split 後的第一部分的其餘部分，例如：Y20，取出 20
    let z = parts[1]; // 提取 split 後的第二部分，例如：Y20-5，取出 5
    return [x, y, z];
}

// 定義兩個 FC 接頭集合
const fcConnectorsStandard = new Set(['B1-1', 'B1-2', 'B1-3', 'B1-4', 'B1-5', 'B1-6', 'B1-7', 'B2-3', 'B2-4', 'B2-5', 'B2-7', 'B2-8', 'B2-9', 'B2-10', 'F13-1', 'K1-2', 'K1-3', 'K1-4', 'K1-7', 'K1-8', 'K2-1', 'K2-2', 'K2-3', 'K2-4', 'K3-1', 'K3-2', 'K3-3', 'K3-4', 'K3-5', 'L1-2', 'L1-3', 'L1-4', 'L1-5', 'L1-6', 'L1-7', 'M1-2', 'M1-3', 'M1-4', 'M1-5', 'M1-6', 'M1-7', 'M1-8', 'M1-10', 'M5-9', 'N1-1', 'N1-2', 'N1-3', 'N1-4', 'N1-5', 'N1-6', 'N1-7', 'N2-1', 'N2-2', 'N2-3', 'N2-4', 'N2-6', 'N2-7', 'N2-8', 'P1-4', 'P1-5', 'P1-6', 'P1-7', 'Q1-1', 'Q1-2', 'Q1-3', 'Q1-4', 'Q3-1']); // 2F 的 FC 接頭
const fcConnectorsCustom1 = new Set(['C7-1', 'C7-2', 'C7-3', 'C7-4', 'Y11-1', 'Y11-2', 'Y11-3', 'Y11-4', 'Y11-5', 'Y12-1', 'Y12-2', 'Y12-3', 'Y12-4', 'Y12-5', 'Y12-6', 'Y12-7', 'Y12-8', 'Y13-11', 'Z12-1', 'Z12-2', 'Z12-3', 'Z12-4', 'Z12-5', 'Z13-1', 'Z13-2', 'Z13-3']); // 1F 的 FC 接頭

function getFCConnectors(floor) {
    switch (floor) {
        case 'custom1':
            return fcConnectorsCustom1;
        case 'standard':
        default:
            return fcConnectorsStandard;
    }
}

function checkConnectorType(coordinate, floor) {
    const fcConnectors = getFCConnectors(floor);
    return fcConnectors.has(coordinate) ? 'FC' : 'SC'; //使用 has 方法檢查檢查 fcConnectors 集合中是否包含指定的 coordinate。
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
            let startConnectorType = checkConnectorType(startLines[i], floor);
            let endConnectorType = checkConnectorType(endLines[i], floor);
            results.push(`從 ${startLines[i]} (${startConnectorType}) 到 ${endLines[i]} (${endConnectorType}) 的長度是: ${length} 公尺`);
        } catch (error) {
            results.push(`輸入格式錯誤：${startLines[i]} 或 ${endLines[i]}`);
        }
    }

    document.getElementById('result').innerHTML = results.join('<br>');
    document.getElementById('result').style.display = 'block';
}
