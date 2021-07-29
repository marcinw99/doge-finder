import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import './components/top-bar';
import './components/upload-image';
import './components/dog-breeds-gallery';

import { load } from '@tensorflow-models/mobilenet';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// eslint-disable-next-line @typescript-eslint/no-duplicate-imports
import { NewImageEventDetail } from './components/upload-image';
import { config } from './config';
import { Breed, Breeds } from './interfaces';
import { getDogAPIDogParameter } from './utils';

@customElement('dog-finder')
export class DogFinder extends LitElement {
  public static styles = css`
    .container {
      padding: 24px;
      max-width: 1000px;
      min-height: calc(100vh - 200px);
      margin: 40px auto 0;
      background: #fff;
      box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.3);
    }

    @media (min-width: 576px) {
      .container {
        max-width: 600px;
      }
    }

    @media (min-width: 768px) {
      .container {
        max-width: 700px;
      }
    }

    @media (min-width: 992px) {
      .container {
        max-width: 800px;
      }
    }
  `;

  @property({ type: Boolean })
  public isSearchingForBreed: boolean = false;

  @state()
  private breedNotFoundForGivenInput: boolean = false;

  @state()
  private breeds: Breeds = [];

  private async searchForPossibleBreeds(
    image: HTMLImageElement,
  ): Promise<Breeds> {
    this.isSearchingForBreed = true;

    const model = await load({
      alpha: 1,
      version: 2,
    });
    const predictions = await model.classify(image);

    this.isSearchingForBreed = false;

    return predictions.map(
      ({ className, probability }): Breed => ({
        dogAPIParameter: getDogAPIDogParameter(className),
        name: className,
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        probability: (probability * 100).toPrecision(3),
      }),
    );
  }

  private async validateAndSetPossibleBreeds(
    possibleBreeds: Breeds,
  ): Promise<void> {
    const validationRequests = possibleBreeds.map(
      async (breed): Promise<Breed | false> => {
        const promise: Promise<Breed | false> = fetch(
          `${config.DOGS_API}/breed/${breed.dogAPIParameter}/images/random`,
        )
          .then((response): Breed | false => {
            if (response.ok) {
              return breed;
            }

            // Breed not found (404)
            return false;
          })
          .catch(
            (): false =>
              // Network error
              false,
          );

        return promise;
      },
    );

    void Promise.all(validationRequests).then((result): void => {
      const foundBreeds = result.filter(Boolean) as Breeds;

      if (foundBreeds.length > 0) {
        this.breeds = foundBreeds;
      } else {
        this.breedNotFoundForGivenInput = true;
      }
    });
  }

  private readonly onNewImage = async (
    event: CustomEvent<NewImageEventDetail>,
  ): Promise<void> => {
    this.breedNotFoundForGivenInput = false;
    const imgElement = event.detail;
    const possibleBreeds = await this.searchForPossibleBreeds(imgElement);

    await this.validateAndSetPossibleBreeds(possibleBreeds);
  };

  public render(): TemplateResult {
    return html`
      <top-bar></top-bar>
      <div class="container">
        <h3>Upload a photo of a dog, and we'll try to guess its breed</h3>
        <div>
          <upload-image @new-image=${this.onNewImage}></upload-image>
          ${this.isSearchingForBreed
            ? html`<progress-spinner></progress-spinner>`
            : ''}
          ${this.breedNotFoundForGivenInput
            ? html`<h3>
                We couldn't find any dog breeds for the provided input, try
                uploading a different image
              </h3>`
            : ''}
        </div>
        ${this.breeds.length > 0
          ? html` <h3>Found him!</h3>
              <dog-breeds-gallery .breeds=${this.breeds}></dog-breeds-gallery>`
          : ``}
      </div>
    `;
  }
}
