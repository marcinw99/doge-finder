export const getFileUrl = async function (file: File): Promise<string | null> {
  return new Promise((resolve, reject): void => {
    const fileReader = new FileReader();

    fileReader.addEventListener('load', (event): void => {
      resolve(event.target?.result?.toString() ?? null);
    });

    fileReader.addEventListener('error', reject);

    fileReader.readAsDataURL(file);
  });
};

export const getDogAPIDogParameter = function (name: string): string {
  /*
   * Example input from tensorflow: 'Golden retriever'
   * Input compatible with Dog API: 'retriever/golden'
   */
  return name.split(' ').reverse().join('/').toLowerCase();
};
