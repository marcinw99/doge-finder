export function getFileUrl(file: File) {
    return new Promise<string | null>((resolve, reject) => {
        var fileReader = new FileReader();

        fileReader.onload = (event) => resolve(event.target?.result?.toString() || null);

        fileReader.onerror = reject;

        fileReader.readAsDataURL(file);
    });
}

export function getDogAPIDogParameter (name: string) {
    // example input from tensorflow: 'Golden retriever'
    // input compatible with Dog API: 'retriever/golden'
    return name.split(' ').reverse().join('/').toLowerCase()
}