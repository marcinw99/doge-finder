export interface Breed {
  name: string;
  dogAPIParameter: string;
  probability: string;
}

export type Breeds = Breed[];

export interface DogAPIListOfImagesResponse {
  message: string[];
  status: string | 'success';
}
