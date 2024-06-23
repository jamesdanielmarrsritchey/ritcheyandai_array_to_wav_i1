function arrayToWavAndDownload(audioSamples, sampleRate = 44100) {
  const numChannels = 2;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;

  // Prepare the WAV file header
  const buffer = new ArrayBuffer(44 + audioSamples.length * 2);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + audioSamples.length * 2, true); // File size minus RIFF identifier and size field
  writeString(view, 8, 'WAVE');

  // fmt subchunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size for PCM
  view.setUint16(20, 1, true); // AudioFormat 1 is PCM
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, byteRate, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, bitsPerSample, true); // BitsPerSample

  // data subchunk
  writeString(view, 36, 'data');
  view.setUint32(40, audioSamples.length * 2, true); // Subchunk2Size

  // Write audio samples
  let offset = 44;
  for (let i = 0; i < audioSamples.length; i++, offset += 2) {
    view.setInt16(offset, audioSamples[i], true); // true for little-endian
  }

  // Create a Blob from the ArrayBuffer
  const blob = new Blob([view], { type: 'audio/wav' });

  // Create a link and trigger the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'output.wav';
  document.body.appendChild(link); // Append link to body
  link.click(); // Simulate click to trigger download
  document.body.removeChild(link); // Remove link from body
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function readNumbersAndConvert(textboxId) {
  // Get the string from the textbox
  const inputString = document.getElementById(textboxId).value;

  // Split the string into an array using a comma or space as delimiter
  const stringArray = inputString.split(/[\s,]+/);

  // Convert the array of strings to an array of integers
  const intArray = stringArray.map(str => parseInt(str, 10));

  // Filter out any NaN values that might have been generated
  const filteredIntArray = intArray.filter(num => !isNaN(num));

  return filteredIntArray;
}

/*
Example:

window.onload = function() {
    const element = document.querySelector("#myElement");
    if (element) {
    		const input_arr = readNumbersAndConvert('textboxId');
    		arrayToWavAndDownload(input_arr);
    }
};

OnClick Example: 

document.querySelector("#myButton").addEventListener("click", function() {
    const element = document.querySelector("#myElement");
    if (element) {
			const input_arr = readNumbersAndConvert('textboxId');
    		arrayToWavAndDownload(input_arr);
    }
});

*/