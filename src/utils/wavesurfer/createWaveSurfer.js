import WaveSurfer from "wavesurfer.js";

export const createWaveSurfer = (base64, waveformRef) => {
    let wave = null;

    wave = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'navy',
        progressColor: 'blue',
        cursorColor: 'purple',
        barWidth: 3,
        height: 45,
        backend: 'WebAudio',
        responsive: true,
        normalize: true,
    });
    wave.setVolume(1);

    const audioBlob = base64ToBlob(base64, 'audio/webm');
    const audioUrl = URL.createObjectURL(audioBlob);
    wave.load(audioUrl);

    return wave;
}

// Función para convertir Base64 a Blob
const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Blob(byteArrays, { type: mimeType });
};
