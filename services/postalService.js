const fs = require('fs');

let users = [];

function readDataFromFile() {
    return new Promise((resolve, reject) => {
        fs.readFile('./jsonfiles/postal_codes.json', (err, data) => {
            if (err) {
                return reject('Error reading postal code file');
            }
            try {
                users = JSON.parse(data);
                resolve();
            } catch (parseError) {
                reject('Error parsing postal code JSON');
            }
        });
    });
}

async function checkPostalCode(postal_code) {
    await readDataFromFile();

    const cleaned_postal_code = postal_code.replace(/\s+/g, ''); // Remove spaces
    const formatted_postal_code = cleaned_postal_code.slice(0, 3) + ' ' + cleaned_postal_code.slice(3);

    if (formatted_postal_code.length === 7 && users.includes(formatted_postal_code)) {
        return "Hi, and welcome, you are in the delivery area :)";
    } else {
        return "Sorry, but you are not in the delivery area :(";
    }
}

module.exports = { checkPostalCode };