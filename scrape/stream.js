const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

function convertMP4toMP3(inputFilePath, outputFilePath) {
    const input = fs.createReadStream(inputFilePath);
    const output = fs.createWriteStream(outputFilePath);

    const command = ffmpeg(input)
        .format('mp3')
        .audioBitrate('128k')
        .audioChannels(2)
        .audioFrequency(44100)
        .on('error', (err) => {
            console.error('An error occurred:', err.message);
        })
        .on('end', () => {
            console.log('Conversion complete');
        });

    command.pipe(output, { end: true });
}

convertMP4toMP3('./run.mp4', './run.mp3');

