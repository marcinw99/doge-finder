import { LitElement, css, html, PropertyValues } from 'lit';
import { customElement, property, state, queryAll } from 'lit/decorators.js';

@customElement('infinite-scroll-gallery')
export class InfiniteScrollGallery extends LitElement {
  static styles = css`
    .gallery {
      text-align: center;
    }

    .gallery__image {
      width: 45%;
      margin: 8px;
    }

    @media (min-width: 768px) {
      .gallery__image {
        width: 21%
      }
    }
  `;

  @property({ type: Array })
  urls: string[] = [];

  @property({ type: Number })
  pageSize: number = 15;

  @property({ type: Number })
  nonLazyImagesAmount: number = 10;

  @state()
  currentPage: number = 1;

  @queryAll('.gallery__image--lazy')
  lazyImages?: HTMLImageElement[];

  onScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.currentPage++;
    }
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this.onScroll);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this.onScroll);
  }

  applyLazyLoading() {
    const imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          // make sure all images have their urls set also in data-src
          image.src = image.dataset.src!;
          image.classList.remove('gallery-image--lazy');
          imageObserver.unobserve(image);
        }
      });
    });

    this.lazyImages?.forEach(function (image) {
      imageObserver.observe(image);
    });
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    this.applyLazyLoading();
  }

  render() {
    const currentlyDisplayedURLs = this.urls.slice(
      0,
      this.pageSize * this.currentPage,
    );

    return html`
      <div class="gallery">
        ${currentlyDisplayedURLs.map((url, index) => {
          const isLazy = index >= this.nonLazyImagesAmount;
          return html`
            <img
              class="gallery__image ${isLazy ? 'gallery__image--lazy' : ''}"
              src=${isLazy ? 'src/assets/doge-placeholder.png' : url}
              data-src=${url}
              alt="doge"
            />
          `;
        })}
      </div>
    `;
  }
}
