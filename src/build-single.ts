import { AxiosError } from 'axios';
import truecallerjs, { SearchData } from 'truecallerjs';
import fs from 'fs';

const phoneNumber = '91';
const jsonFilePath = __dirname + '/generatedData.json';
const maxRetries = 3;

async function generateJson() {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const searchData: SearchData = {
        number: phoneNumber,
        countryCode: 'IN',
        installationId: 'a1i0S--kPcyD3FJkAZYDrsShzKrYz375041NZb4xrfdlFKUZcfV53NIaQ76o5K_V',
      };

      const response = await truecallerjs.search(searchData);

      const responseData = {
        id: generateUniqueId(),
        phoneNumber: phoneNumber, 
        name: response.getName() || 'N/A',
        alternateName: response.getAlternateName() || 'N/A',
        addresses: response.getAddresses() || [],
        emailId: response.getEmailId() || 'N/A',
        countryDetails: response.getCountryDetails() || 'N/A',
      };

      writeToJsonFile(responseData);

      console.log('JSON data generated and saved successfully.');

      process.exit(0);
    } catch (error) {
      if ((error as AxiosError)?.response?.status === 429) {
        console.log(`Rate limit exceeded. Retrying in 5 seconds. Retry ${retries + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, 5000)); 
        retries++;
      } else {
        console.error('An error occurred:', error);
        process.exit(1); 
      }
    }
  }
}

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function writeToJsonFile(data: any) {
  try {
    let existingData: any[] = [];

    if (fs.existsSync(jsonFilePath)) {
      const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');

      if (fileContent.trim() !== '') {
        existingData = JSON.parse(fileContent);
      }
    }

    const idExists = existingData.some((entry: any) => entry.id === data.id);

    if (!idExists) {
      existingData.push(data);

      fs.writeFileSync(jsonFilePath, JSON.stringify(existingData, null, 2));

      console.log('Data appended to the JSON file:', data);
    } else {
      console.log('ID already exists. Skipping...');
    }
  } catch (error) {
    console.error('Error writing to JSON file:', error);
  }
}

generateJson();
