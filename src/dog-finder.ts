import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';

import { load } from '@tensorflow-models/mobilenet';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import './components/top-bar';
import './components/upload-image';
import './components/dog-breeds-gallery';

import config from './config';
import { getDogAPIDogParameter } from './utils';
import { NewImageEventDetail } from './components/upload-image';

export interface IBreed {
  name: string;
  dogAPIParameter: string;
  probability: string;
}

export type Breeds = Array<IBreed>;

@customElement('dog-finder')
export class DogFinder extends LitElement {
  @property({ type: Boolean })
  isSearchingForBreed: boolean = false;

  @property({ type: Array })
  breeds: Breeds = [];

  async searchForPossibleBreeds(image: HTMLImageElement): Promise<Breeds> {
    this.isSearchingForBreed = true;

    const model = await load({
      version: 2,
      alpha: 1,
    });
    const predictions = await model.classify(image);

    this.isSearchingForBreed = false;
    if (predictions) {
      return predictions.map(({ className, probability }) => ({
        name: className,
        dogAPIParameter: getDogAPIDogParameter(className),
        probability: (probability * 100).toPrecision(3),
      }));
    } else {
      return [];
    }
  }

  async validateAndSetPossibleBreeds(possibleBreeds: Breeds) {
    const validationRequests = possibleBreeds.map((breed) => {
      const promise: Promise<false | IBreed> = fetch(
        `${config.DOGS_API}/breed/${breed.dogAPIParameter}/images/random`,
      )
        .then((response) => {
          if (response.ok) {
            return breed;
          }
          return false
        })
        .catch(() => {
          return false;
        });
      return promise;
    });

    Promise.all(validationRequests).then((result) => {
      this.breeds = result.filter((item) => !!item) as IBreed[];
    });
  }

  async onNewImage(event: CustomEvent<NewImageEventDetail>) {
    const imgElement = event.detail;
    const possibleBreeds = await this.searchForPossibleBreeds(imgElement);

    if (possibleBreeds) {
      // TODO
      this.validateAndSetPossibleBreeds(possibleBreeds);
    } else {
      // TODO error
    }
  }

  render() {
    return html`
      <top-bar></top-bar>
      <h4>Upload a photo of a dog and we'll try to guess its breed</h4>
      <upload-image @new-image=${this.onNewImage}></upload-image>
      <dog-info></dog-info>
      ${this.breeds.length
        ? html`<dog-breeds-gallery .breeds=${this.breeds}></dog-breeds-gallery>`
        : `no breeds shown`}
    `;
  }
}
