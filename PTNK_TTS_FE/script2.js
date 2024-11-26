let langOption = document.querySelectorAll("select");
let fromText = document.querySelector(".fromText");
let transText = document.querySelector(".toTranslate");
let fromVoice = document.querySelector(".from");
let toVoice = document.querySelector(".to");
let cpyBtn = document.querySelector(".bx-copy");
let countValue = document.querySelector(".code_length");
let exchangeLang = document.querySelector(".bx-transfer");

const BASE_API_URL = "http://localhost:3001/"

langOption.forEach((get, con) => {
  for (let countryCode in language) {
    let selected;
    if (con == 0 && countryCode == "en") {
      selected = "selected";
    } else if (con == 1 && countryCode == "vi") {
      selected = "selected";
    }

    let option = `<option value="${countryCode}" ${selected}>${language[countryCode]}</option>`;
    get.insertAdjacentHTML("beforeend", option);
  }
});

function to_vietnamese(input) {
  var default_numbers = ' hai ba bốn năm sáu bảy tám chín';
  var dict = {
      units: ('? một' + default_numbers).split(' '),
      tens: ('lẻ mười' + default_numbers).split(' '),
      hundreds: ('không một' + default_numbers).split(' ')
  };
  const tram = 'trăm';
  var digits = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ', 'tỷ tỷ'];

  // Hàm xử lý hàng chục
  function tenth(block_of_2) {
      var sl1 = dict.units[block_of_2[1]];
      var result = [dict.tens[block_of_2[0]]];
      if (block_of_2[0] > 0 && block_of_2[1] == 5)
          sl1 = 'lăm';
      if (block_of_2[0] > 1) {
          result.push('mươi');
          if (block_of_2[1] == 1)
              sl1 = 'mốt';
      }
      if (sl1 != '?') result.push(sl1);
      return result.join(' ');
  }

  // Hàm xử lý nhóm 3 chữ số
  function block_of_three(block) {
      switch (block.length) {
          case 1:
              return dict.units[block];
          case 2:
              return tenth(block);
          case 3:
              var result = [dict.hundreds[block[0]], tram];
              if (block.slice(1, 3) != '00') {
                  var sl12 = tenth(block.slice(1, 3));
                  result.push(sl12);
              }
              return result.join(' ');
      }
      return '';
  }

  // Hàm thêm các đơn vị nghìn, triệu, tỷ
  function digit_counting(i) {
      return digits[i] || '';
  }

  var str = BigInt(input).toString(); // Đảm bảo xử lý số lớn
  var index = str.length;
  if (index == 0 || isNaN(str))
      return '';
  var arr = [];
  var result = [];

  // Tách số thành các nhóm 3 chữ số
  while (index > 0) {
      arr.unshift(str.substring(Math.max(0, index - 3), index));
      index -= 3;
  }

  // Xử lý từng nhóm
  for (let i = 0; i < arr.length; i++) {
      if (arr[i] === '000') continue; // Bỏ qua nhóm 000
      let groupText = block_of_three(arr[i]);
      if (groupText) {
          result.push(groupText.trim());
          let unit = digit_counting(arr.length - 1 - i);
          if (unit) result.push(unit);
      }
  }

  // Xóa khoảng trắng thừa và trả kết quả
  return result.join(' ').replace(/\s+/g, ' ').trim();
}

function to_english(input, precision = 0) {
  const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion'];

  function roundNumber(number, precision) {
    const factor = 10 ** precision;
    return Math.round(number * factor) / factor;
  }

  function convertTens(number) {
    if (number === 10) return "ten";
    if (number < 10) return ones[number];
    if (number < 20) return teens[number - 11];
    const [tensDigit, onesDigit] = String(number).padStart(2, "0");
    return `${tens[tensDigit]}${onesDigit !== "0" ? ` ${ones[onesDigit]}` : ""}`;
  }

  function convertHundreds(number, isLastBlock = false) {
    const [hundredsDigit, ...rest] = String(number).padStart(3, "0");
    const remainder = Number(rest.join(""));

    let result = "";
    if (hundredsDigit !== "0") {
      result += `${ones[hundredsDigit]} hundred`;
      if (remainder > 0) result += " and ";
    }

    if (remainder > 0) {
      result += convertTens(remainder);
    }

    if (isLastBlock && remainder === 10) {
      result = result.replace(/(\d+)$/, "and ten");
    }

    return result;
  }

  function processNumber(number, precision) {
    if (number === "0") return "zero";

    number = roundNumber(number, precision);

    const chunks = [];
    let strNumber = BigInt(number).toString();

    while (strNumber.length > 0) {
      const chunk = strNumber.slice(-3);
      chunks.unshift(chunk);
      strNumber = strNumber.slice(0, -3);
    }

    const result = [];
    let lastBlockIndex = chunks.length - 1;

    chunks.forEach((chunk, index) => {
      const scale = scales[lastBlockIndex - index];
      const chunkValue = Number(chunk);
      if (chunkValue > 0) {
        result.push(`${convertHundreds(chunkValue, lastBlockIndex === index)}${scale ? ` ${scale}` : ""}`);
      }
    });

    let finalResult = result.join(" ").trim();

    finalResult = finalResult.replace(/(\d+)(\s+)(hundred|thousand|million|billion|trillion|quadrillion|quintillion)/g, '$1 and$2$3');

    if (finalResult.endsWith("ten") || finalResult.endsWith(" hundred") || finalResult.endsWith(" thousand")) {
      finalResult = finalResult.replace(/(\d+)(\s+)(hundred|thousand|million|billion|trillion|quadrillion|quintillion)$/g, '$1 and$2$3');
    }

    return finalResult;
  }

  if (isNaN(input) || input === null || input === "" || BigInt(input) > 1e18) {
    return "Invalid input";
  }

  return processNumber(input.toString().trim(), precision);

async function getBase64Tts(text, lang) {
  return axios(BASE_API_URL + 'tts', {
    params: { text, lang },
  }).then((res) => res.data);
}

fromText.addEventListener("input", (e) => {
  if (langOption[0].value === "vi") {
    const text = to_vietnamese(fromText.value);
    transText.value = text;
  }
  else if(langOption[0].value == "en") {
    const text = to_english(fromText.value);
    transText.value = text;
  }
})

toVoice.addEventListener("click", async () => {
  try {
    const audioBase64 = await getBase64Tts(transText.value, langOption[0].value);
    const base64Audio = 'data:audio/mp3;base64,' + audioBase64;

    // Convert base64 to Blob and create a URL
    const audioBlob = await fetch(base64Audio).then((res) => res.blob());
    const audioUrl = URL.createObjectURL(audioBlob);

    // Play audio
    const audio = new Audio(audioUrl);
    await audio.play();
  } catch {
    alert('Language not supported');
  }
})

cpyBtn.addEventListener("click", function () {
  navigate.clipboard.writeText(transText.value);
});

fromText.addEventListener("keyup", function () {
  countValue.innerHTML = `${fromText.value.length}/5,000`;
});
