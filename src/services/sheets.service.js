// A Group: https://sheets.googleapis.com/v4/spreadsheets/15vUn5-byqvgrjmQiU8ciLDVpaePYNDH6jSj1_sfbbgw/values/Fikst%C3%BCr!B2:B7?key={apiKey}
// B Group: https://sheets.googleapis.com/v4/spreadsheets/15vUn5-byqvgrjmQiU8ciLDVpaePYNDH6jSj1_sfbbgw/values/Fikst%C3%BCr!B9:B14?key={apiKey}
// C Group: https://sheets.googleapis.com/v4/spreadsheets/15vUn5-byqvgrjmQiU8ciLDVpaePYNDH6jSj1_sfbbgw/values/Fikst%C3%BCr!B16:B21?key={apiKey}
// D Group: https://sheets.googleapis.com/v4/spreadsheets/15vUn5-byqvgrjmQiU8ciLDVpaePYNDH6jSj1_sfbbgw/values/Fikst%C3%BCr!B23:B28?key={apiKey}
// Match 1-40 : https://sheets.googleapis.com/v4/spreadsheets/15vUn5-byqvgrjmQiU8ciLDVpaePYNDH6jSj1_sfbbgw/values/Fikst%C3%BCr!D3:J42?key={apiKey}
// Q1 -41st Match  : https://sheets.googleapis.com/v4/spreadsheets/15vUn5-byqvgrjmQiU8ciLDVpaePYNDH6jSj1_sfbbgw/values/Fikst%C3%BCr!M7:M10?key={apiKey}
// Q2 -42nd Match  : https://sheets.googleapis.com/v4/spreadsheets/15vUn5-byqvgrjmQiU8ciLDVpaePYNDH6jSj1_sfbbgw/values/Fikst%C3%BCr!M12:M15?key={apiKey}
// Q3 -43th Match  : https://sheets.googleapis.com/v4/spreadsheets/15vUn5-byqvgrjmQiU8ciLDVpaePYNDH6jSj1_sfbbgw/values/Fikst%C3%BCr!M17:M20?key={apiKey}
// Q4 -44th Match  : https://sheets.googleapis.com/v4/spreadsheets/15vUn5-byqvgrjmQiU8ciLDVpaePYNDH6jSj1_sfbbgw/values/Fikst%C3%BCr!M22:M25?key={apiKey}
// S1 -45th Match  : https://sheets.googleapis.com/v4/spreadsheets/15vUn5-byqvgrjmQiU8ciLDVpaePYNDH6jSj1_sfbbgw/values/Fikst%C3%BCr!O10:O13?key={apiKey}
// S2 -46th Match  : https://sheets.googleapis.com/v4/spreadsheets/15vUn5-byqvgrjmQiU8ciLDVpaePYNDH6jSj1_sfbbgw/values/Fikst%C3%BCr!O20:O23?key={apiKey}
// third place match match -47th Match  : https://sheets.googleapis.com/v4/spreadsheets/15vUn5-byqvgrjmQiU8ciLDVpaePYNDH6jSj1_sfbbgw/values/Fikst%C3%BCr!Q15:Q18?key={apiKey}
// Final -48th Match  : https://sheets.googleapis.com/v4/spreadsheets/15vUn5-byqvgrjmQiU8ciLDVpaePYNDH6jSj1_sfbbgw/values/Fikst%C3%BCr!R15:R18?key={apiKey}
//Scores
// A Group  : https://sheets.googleapis.com/v4/spreadsheets/15vUn5-byqvgrjmQiU8ciLDVpaePYNDH6jSj1_sfbbgw/values/Fikst%C3%BCr!T7:Y12?key={apiKey}
// B Group  : https://sheets.googleapis.com/v4/spreadsheets/15vUn5-byqvgrjmQiU8ciLDVpaePYNDH6jSj1_sfbbgw/values/Fikst%C3%BCr!T14:Y19?key={apiKey}
// C Group  : https://sheets.googleapis.com/v4/spreadsheets/15vUn5-byqvgrjmQiU8ciLDVpaePYNDH6jSj1_sfbbgw/values/Fikst%C3%BCr!T21:Y26?key={apiKey}
// D Group  : https://sheets.googleapis.com/v4/spreadsheets/15vUn5-byqvgrjmQiU8ciLDVpaePYNDH6jSj1_sfbbgw/values/Fikst%C3%BCr!T28:Y33?key={apiKey}


import axios from "axios";

const baseUrl =
  "https://sheets.googleapis.com/v4/spreadsheets/15vUn5-byqvgrjmQiU8ciLDVpaePYNDH6jSj1_sfbbgw/values/Fikst%C3%BCr!";
const apiKey = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;

async function fetchMatches() {
  try {
    const response = await axios.get(`${baseUrl}D3:J42?key=${apiKey}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
}

async function fetchGroupA() {
  try {
    const response = await axios.get(`${baseUrl}U8:Z12?key=${apiKey}`);
    return response.data.values;
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw error;
  }
}
async function fetchGroupB() {
  try {
    const response = await axios.get(`${baseUrl}U15:Z19?key=${apiKey}`);
    return response.data.values;
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw error;
  }
}

async function fetchGroupC() {
  try {
    const response = await axios.get(`${baseUrl}U22:Z26?key=${apiKey}`);
    return response.data.values;
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw error;
  }
}

async function fetchGroupD() {
  try {
    const response = await axios.get(`${baseUrl}U29:Z33?key=${apiKey}`);
    return response.data.values;
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw error;
  }
}

async function fetchGroups() {
  try {
    const groupA = await fetchGroupA();
    const groupB = await fetchGroupB();
    const groupC = await fetchGroupC();
    const groupD = await fetchGroupD();
    return [groupA, groupB, groupC, groupD];
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw error;
  }
}

const SheetsService = {
  fetchMatches,
  fetchGroups,
};

export default SheetsService;
