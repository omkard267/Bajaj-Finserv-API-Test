const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const USER_INFO = {
  fullName: 'omkar_dhumal',
  email: 'omkardhumal267@gmail.com',
  rollNumber: '112216017'
};

const FIXED_DATE = '06102025';

function generateUserId(fullName, dateString) {
  return `${fullName.toLowerCase()}_${dateString}`;
}

function isNumber(str) {
  return /^-?\d+$/.test(str);
}

function isAlphabet(str) {
  return /^[a-zA-Z]+$/.test(str);
}

function isSpecialChar(str) {
  return /^[^a-zA-Z0-9]+$/.test(str);
}

function sanitize(str) {
  return str
    .replace(/[""'']/g, '')
    .trim();
}

function createConcatString(alphabets) {
  const allChars = alphabets.join('').split('').reverse();
  return allChars
    .map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join('');
}

app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        error: 'Invalid input. Expected an array in "data" field.'
      });
    }

    const oddNumbers = [];
    const evenNumbers = [];
    const alphabets = [];
    const specialCharacters = [];
    let sum = 0;

    data.forEach(item => {
      let str = String(item).trim();
      str = sanitize(str);

      if (isNumber(str)) {
        const num = parseInt(str, 10);
        sum += num;

        if (num % 2 === 0) {
          evenNumbers.push(str);
        } else {
          oddNumbers.push(str);
        }
      } else if (isAlphabet(str)) {
        alphabets.push(str.toUpperCase());
      } else if (isSpecialChar(str)) {
        specialCharacters.push(str);
      }
    });

    const response = {
      is_success: true,
      user_id: generateUserId(USER_INFO.fullName, FIXED_DATE),
      email: USER_INFO.email,
      roll_number: USER_INFO.rollNumber,
      odd_numbers: oddNumbers,
      even_numbers: evenNumbers,
      alphabets: alphabets,
      special_characters: specialCharacters,
      sum: String(sum),
      concat_string: createConcatString(alphabets)
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      is_success: false,
      error: 'Internal server error'
    });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/bfhl`);
});