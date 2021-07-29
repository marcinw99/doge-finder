import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import './infinite-scroll-gallery'

import config from '../config'
import { Breeds, IBreed } from '../dog-finder';

@customElement('dog-breeds-gallery')
export class DogBreedsGallery extends LitElement {
  static styles = css`
    .dog-breeds-gallery {
      margin-top: 24px;
    }
    
    .dog-breeds-gallery__breed-tab {
      font-size: 1.3rem;
      padding: 6px 12px;
      margin-right: 4px
    }

    .dog-breeds-gallery__breed-tab--active {
      color: green;
    }
  `;

  @property({ type: Array })
  breeds: Breeds = [];

  @state()
  isFetching: boolean = false

  @state()
  selectedBreed?: IBreed;

  @state()
  selectedBreedImagesURLs: string[] = []

  connectedCallback() {
    super.connectedCallback()
    // TODO guard against multiple connectedCallback calls
    this.selectBreed(this.breeds[0])
  }

  selectBreed(breed: IBreed) {
    this.selectedBreed = breed;
    this.fetchImagesUrlsForSelectedBreed()
  }

  fetchImagesUrlsForSelectedBreed () {
    if (!this.selectedBreed) {
      return
    }
    this.isFetching = true
    fetch(`${config.DOGS_API}/breed/${this.selectedBreed.dogAPIParameter}/images/random/100`)
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('Something went wrong')
          }
        })
        .then(data => {
          this.selectedBreedImagesURLs = data.message
        })
        .catch(() => {
          // TODO error when fetching list of images
        })
        .finally(() => {
            this.isFetching = false
        })
  }

  render() {
    return html`
      <div class="dog-breeds-gallery">
        <div class="dog-breeds-gallery__breed-tabs-container">
          ${this.breeds.map((breed) => {
            const isActive = this.selectedBreed?.name === breed.name;
            return html`
              <button
                type="button"
                class="dog-breeds-gallery__breed-tab ${isActive
                  ? 'dog-breeds-gallery__breed-tab--active'
                  : ''}"
                ?disabled=${isActive}
                @click=${() => this.selectBreed(breed)}
              >
                ${breed.name} (${breed.probability}%)
              </button>
            `;
          })}
        </div>
        ${this.isFetching ? html`<progress-spinner></progress-spinner>` : ''}
        <infinite-scroll-gallery .urls=${this.selectedBreedImagesURLs}></infinite-scroll-gallery>
      </div>
    `;
  }
}
