const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Define the folder path
const folderPath = path.join(__dirname, 'files');

// Ensure the folder exists
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true }); // Create folder if not exists
}

// Helper function to format the filename with current date and time
function getFormattedFileName() {
    const date = new Date();
    const formattedDate = date.toISOString().replace(/[:.]/g, '-'); // Replacing problematic characters
    return `${formattedDate}.txt`; // File extension
}

// Endpoint to create a text file with the current date-time as the filename
app.post('/createFile', (req, res) => {
    const fileName = getFormattedFileName(); // Generate filename based on date-time
    const filePath = path.join(folderPath, fileName); // Full path to the file

    // Write the text file with current timestamp
    fs.writeFile(filePath, new Date().toISOString(), (err) => {
        if (err) {
            console.error('Error creating file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ message: 'File created successfully', fileName }); // Success response with filename
    });
});

// Endpoint to list all text files in the 'files' folder
app.get('/files', (req, res) => {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Filter to include only text files
        const textFiles = files.filter(file => path.extname(file) === '.txt');

        res.json({ files: textFiles }); // Return the list of text files
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
