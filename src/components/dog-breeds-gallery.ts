import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import './infinite-scroll-gallery'

import config from '../config'
import { Breeds, IBreed } from '../dog-finder';

@customElement('dog-breeds-gallery')
export class DogBreedsGallery extends LitElement {
  static styles = css`
    .dog-breeds-gallery__breed-tab {
    }

    .dog-breeds-gallery__breed-tab--active {
      color: green;
    }
  `;

  @property({ type: Array })
  breeds: Breeds = [];

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
          // TOAST error when fetching images of dogs
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
                ${breed.name}
              </button>
            `;
          })}
        </div>
        <infinite-scroll-gallery .urls=${this.selectedBreedImagesURLs}></infinite-scroll-gallery>
      </div>
    `;
  }
}
