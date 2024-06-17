import { csvParse } from 'd3-dsv';

const loadZipCodeData = async () => {
  const response = await fetch('/uszips-krish.csv');
  const csvData = await response.text();
  
  const zipCodeData = {};
  
  const parsedData = csvParse(csvData);
  parsedData.forEach((row) => {
    zipCodeData[row.zip] = {
      city: row.city,
      state_id: row.state_id,
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng),
      county_name: row.county_name,
    };
  });

  return zipCodeData;
};

export default loadZipCodeData;