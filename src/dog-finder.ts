import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';

import { load } from '@tensorflow-models/mobilenet';
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

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
  static styles = css`
    .container {
      padding: 24px;
      max-width: 1000px;
      min-height: calc(100vh - 200px);
      margin: 40px auto 0;
      background: #fff;
      box-shadow: 0px 0px 7px 0px rgba(0,0,0,0.3);
    }
    
    @media (min-width: 576px) {
      .container {
        max-width: 600px;
      }
    }
    
    @media (min-width: 768px) {
      .container {
        max-width: 700px
      }
    }
    
    @media (min-width: 992px) {
      .container {
        max-width: 800px;
      }
    }
  `
  @property({ type: Boolean })
  isSearchingForBreed: boolean = false;

  @state()
  breeds: Breeds = [];

  @state()
  breedNotFoundForGivenInput: boolean = false

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
          // breed not found (404)
          return false;
        })
        .catch(() => {
          // network error
          return false;
        });
      return promise;
    });

    Promise.all(validationRequests).then((result) => {
      const foundBreeds = result.filter((item) => !!item) as IBreed[];
      if (foundBreeds.length) {
        this.breeds = foundBreeds
      } else {
        this.breedNotFoundForGivenInput = true
      }
    });
  }

  async onNewImage(event: CustomEvent<NewImageEventDetail>) {
    this.breedNotFoundForGivenInput = false
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
      <div class="container">
        <h3>Upload a photo of a dog, and we'll try to guess its breed</h3>
        <div>
            <upload-image @new-image=${this.onNewImage}></upload-image>
            ${this.isSearchingForBreed ? html`<progress-spinner></progress-spinner>` : ''}
            ${this.breedNotFoundForGivenInput ? html`<h3>We couldn't find any dog breeds for the provided input, try uploading a different image</h3>` : ''}
        </div>
        ${this.breeds.length
          ? html`
              <h3>Found him!</h3>
              <dog-breeds-gallery
              .breeds=${this.breeds}
            ></dog-breeds-gallery>`
          : ``}
      </div>
    `;
  }
}
