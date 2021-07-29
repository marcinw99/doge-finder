import './infinite-scroll-gallery';

import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { config } from '../config';
import { Breed, Breeds, DogAPIListOfImagesResponse } from '../interfaces';

@customElement('dog-breeds-gallery')
export class DogBreedsGallery extends LitElement {
  public static styles = css`
    .dog-breeds-gallery {
      margin-top: 24px;
    }

    .dog-breeds-gallery__breed-tab {
      font-size: 1.3rem;
      padding: 6px 12px;
      margin-right: 4px;
    }

    .dog-breeds-gallery__breed-tab--active {
      color: green;
    }
  `;

  @property({ type: Array })
  public breeds: Breeds = [];

  @state()
  private isFetching: boolean = false;

  @state()
  private selectedBreed: Breed | null = null;

  @state()
  private selectedBreedImagesURLs: string[] = [];

  public connectedCallback(): void {
    super.connectedCallback();
    // TODO guard against multiple connectedCallback calls
    this.selectBreed(this.breeds[0]);
  }

  private selectBreed(breed: Breed): void {
    this.selectedBreed = breed;
    this.fetchAndSetImagesUrlsForSelectedBreed();
  }

  private fetchAndSetImagesUrlsForSelectedBreed(): void {
    if (this.selectedBreed === null) {
      return;
    }

    this.isFetching = true;
    fetch(
      `${config.DOGS_API}/breed/${this.selectedBreed.dogAPIParameter}/images/random/100`,
    )
      .then(async (response): Promise<DogAPIListOfImagesResponse> => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then((data): void => {
        this.selectedBreedImagesURLs = data.message;
      })
      .catch((): void => {
        // TODO error when fetching list of images
      })
      .finally((): void => {
        this.isFetching = false;
      });
  }

  public render(): TemplateResult {
    return html`
      <div class="dog-breeds-gallery">
        <div class="dog-breeds-gallery__breed-tabs-container">
          ${this.breeds.map((breed): TemplateResult => {
            const isActive = this.selectedBreed?.name === breed.name;

            return html`
              <button
                type="button"
                class="dog-breeds-gallery__breed-tab ${isActive
                  ? 'dog-breeds-gallery__breed-tab--active'
                  : ''}"
                ?disabled=${isActive}
                @click=${(): void => {
                  this.selectBreed(breed);
                }}
              >
                ${breed.name} (${breed.probability}%)
              </button>
            `;
          })}
        </div>
        ${this.isFetching ? html`<progress-spinner></progress-spinner>` : ''}
        <infinite-scroll-gallery
          .urls=${this.selectedBreedImagesURLs}
        ></infinite-scroll-gallery>
      </div>
    `;
  }
}
