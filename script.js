function letterToNumber(letter) {
  return letter.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
}

function zToHeightStandard(z) {
  return 2.7 - ((z - 1) * (2.7 - 0.3)) / (10 - 1); //2F 機房 z 值轉換實際高度值
}

function zToHeightCustom1(z) {
  return z * 0.3; // 1F 機房 z 值轉換實際高度值
}

function getZHeightFunction(floor) {
  switch (floor) {
    case "custom1":
      return zToHeightCustom1;
    case "standard":
    default:
      return zToHeightStandard;
  }
}

function calculateFiberLengthStandard(x1, y1, z1, x2, y2, z2) {
  x1 = letterToNumber(x1);
  x2 = letterToNumber(x2);

  let xyLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    // 檢查是否在同一排（x座標相同）
    const isSameRow = x1 === x2;

  let zToHeight = getZHeightFunction("standard");
  let z1Height = zToHeight(z1);
  let z2Height = zToHeight(z2);

  let zLength;
  if (isSameRow) { // 當在同一排時，只計算 z 高度差的絕對值，不需要兩端都加總
    zLength = Math.abs(z1Height - z2Height); // 如果 z 值相同，給予最小高度補正
    if (z1 === z2) {
      zLength = 0.3; // 最小高度補正
    }
  } else { // 不在同一排時維持原有計算方式
    zLength = z1Height + z2Height;
  }
  
  let totalLength = xyLength + zLength + 1.2; //補正值 1.2 米
  console.log(totalLength);
  return Math.ceil(totalLength);
}

function calculateFiberLengthCustom1(x1, y1, z1, x2, y2, z2) {
  x1 = letterToNumber(x1);
  x2 = letterToNumber(x2);

  let xyLength = Math.abs(y1 - y2) * 0.6; //只根據 y1、y2 值差值計算橫向距離

  let zToHeight = getZHeightFunction("custom1");
  let z1Height = zToHeight(z1);
  let z2Height = zToHeight(z2);

  let zLength = z1Height + z2Height;

  let totalLength = xyLength + zLength + 1.2 + 1.2; //第一個 1.2 米為最長距離應經過 4 個線槽 (0.3*4), 第二個補正值為 1.6 米(補正值為 0.6 米 + 1 米為含 OPEN RACK 上線槽的空間 8/3:補正值改為1.2米) //1.35 備用
  console.log(totalLength);
  return Math.ceil(totalLength);
}

function getFiberLengthFunction(floor) {
  switch (floor) {
    case "custom1":
      return calculateFiberLengthCustom1;
    case "standard":
    default:
      return calculateFiberLengthStandard;
  }
}

function parseCoordinatePair(pair) {
  let coordinates = pair.split(".");
  let startCoordinate = parseCoordinate(coordinates[0]);
  let endCoordinate = parseCoordinate(coordinates[1]);
  return [startCoordinate, endCoordinate];
}

function parseCoordinate(coordinate) {
  let parts = coordinate.split("-");
  let xy = parts[0]; //提取 split 後的首個部分，例如：Y20-5，取出 Y20。
  let x = xy.charAt(0); //讓 x = split 後的第一部分的首個字元，例如：Y20，取出 Y，
  let y = xy.slice(1); //刪除 x = split 後的第一個字元並取出，例如：Y20，刪除 Y，取出 20，
  let z = parts[1]; //提取 split 後的第二部分，例如：Y20-5，取出 5 。
  return [x, y, z];
}

function getConnectors(floor) {
  switch (floor) {
    case "custom1":
      return {
        fcConnectors: new Set([
          "C7-1",
          "C7-2",
          "C7-3",
          "C7-4",
          "Y11-1",
          "Y11-2",
          "Y11-3",
          "Y11-4",
          "Y11-5",
          "Y12-1",
          "Y12-2",
          "Y12-3",
          "Y12-4",
          "Y12-5",
          "Y12-6",
          "Y12-7",
          "Y12-8",
          "Y13-11",
          "Z12-1",
          "Z12-2",
          "Z12-3",
          "Z12-4",
          "Z12-5",
          "Z13-1",
          "Z13-2",
          "Z13-3",
        ]),
      };
    case "standard":
      return {
        fcConnectors: new Set([
          "B1-1",
          "B1-2",
          "B1-3",
          "B1-4",
          "B1-5",
          "B1-6",
          "B1-7",
          "B2-3",
          "B2-4",
          "B2-5",
          "B2-7",
          "B2-8",
          "B2-9",
          "B2-10",
          "F13-1",
          "K1-2",
          "K1-3",
          "K1-4",
          "K1-5",
          "K1-6",
          "K1-7",
          "K1-8",
          "K2-1",
          "K2-2",
          "K2-3",
          "K2-4",
          "K3-1",
          "K3-2",
          "K3-3",
          "K3-4",
          "K3-5",
          "L1-2",
          "L1-3",
          "L1-4",
          "L1-5",
          "L1-6",
          "L1-7",
          "M1-2",
          "M1-3",
          "M1-4",
          "M1-5",
          "M1-6",
          "M1-7",
          "M1-8",
          "M1-10",
          "M5-9",
          "N1-1",
          "N1-2",
          "N1-3",
          "N1-4",
          "N1-5",
          "N1-6",
          "N1-7",
          "N2-1",
          "N2-2",
          "N2-3",
          "N2-4",
          "N2-6",
          "N2-7",
          "N2-8",
          "P1-4",
          "P1-5",
          "P1-6",
          "P1-7",
          "Q1-1",
          "Q1-2",
          "Q1-3",
          "Q1-4",
          "Q3-1",
        ]),
        lcConnectors: new Set([
          "R3-2",
          "R3-3",
          "R3-4",
          "Z11-1",
          "Z11-2",
          "Z11-3",
          "Z11-4",
          "Z11-5",
          "Z11-6",
          "Z11-7",
          "Z11-8",
        ]),
      };
    default:
      return new Set();
  }
}

//new Set(['3N-1','3N-2','3N-3','3N-4','3N-7','3N-8'])

function checkConnectorType(coordinate, floor) {
  const connectors = getConnectors(floor);
  if (
    connectors.fcConnectors &&
    connectors.fcConnectors.has(coordinate.toUpperCase())
  ) {
    return "FC";
  } else if (
    connectors.lcConnectors &&
    connectors.lcConnectors.has(coordinate.toUpperCase())
  ) {
    return "LC";
  } else {
    return "SC";
  }
}

function calculateLengths() {
  let coordinatesInput = document.getElementById("coordinates").value.trim();
  let floor = document.getElementById("floor").value;
  let lines = coordinatesInput.split("\n"); //將輸入的座標按斷行分割成數組，每行一個起始座標與終點座標

  let results = [];
  let calculateFiberLength = getFiberLengthFunction(floor); //根據樓層選擇光纖長度計算函數

  for (let line of lines) {
    // 遍歷每一行起始座標與終點座標
    try {
      let [startCoordinate, endCoordinate] = parseCoordinatePair(line); //將座標組對解析成起點座標和終點坐標。
      let [x1, y1, z1] = startCoordinate; //從起點坐標數組中取出 x, y, z 值
      let [x2, y2, z2] = endCoordinate; //從終點坐標數組中取出 x, y, z 值
      let length = calculateFiberLength(x1, y1, z1, x2, y2, z2); // 計算光纖長度
      let startConnectorType = checkConnectorType(`${x1}${y1}-${z1}`, floor); //檢查起點座標的接頭類型
      let endConnectorType = checkConnectorType(`${x2}${y2}-${z2}`, floor); //檢查終點座標的接頭類型
      let startConnectorTypeFormatted = `${startConnectorType}`; //格式化 startConnectorType
      let endConnectorTypeFormatted = `${endConnectorType}`; //格式化 endConnectorType

      if (startConnectorType === "FC") {
        //如果是 FC，使用 <span style="color: red;"> 裝飾文字
        startConnectorTypeFormatted = `<span style="color: red;">${startConnectorTypeFormatted}</span>`;
      }

      if (endConnectorType === "FC") {
        //如果是 FC，使用 <span style="color: red;"> 裝飾文字
        endConnectorTypeFormatted = `<span style="color: red;">${endConnectorTypeFormatted}</span>`;
      }

      if (startConnectorType === "LC") {
        //如果是 LC，使用 <span style="color: blue;"> 裝飾文字
        startConnectorTypeFormatted = `<span style="color: blue;">${startConnectorTypeFormatted}</span>`;
      }

      if (endConnectorType === "LC") {
        //如果是 LC，使用 <span style="color: blue;"> 裝飾文字
        endConnectorTypeFormatted = `<span style="color: blue;">${endConnectorTypeFormatted}</span>`;
      }

      results.push(
        `從 ${line.split(".")[0]}(${startConnectorTypeFormatted}) 到 ${
          line.split(".")[1]
        }(${endConnectorTypeFormatted}) 的光纖線長度是: ${length} 公尺`
      );
    } catch (error) {
      results.push(`輸入格式錯誤：${line}`);
    }
  }

  document.getElementById("result").innerHTML = results.join("<br>");
  document.getElementById("result").style.display = "block";
}
