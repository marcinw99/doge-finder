import { css, html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, queryAll, state } from 'lit/decorators.js';

import { config } from '../config';

@customElement('infinite-scroll-gallery')
export class InfiniteScrollGallery extends LitElement {
  public static styles = css`
    .gallery {
      text-align: center;
    }

    .gallery__image {
      width: 45%;
      margin: 8px;
    }

    @media (min-width: 768px) {
      .gallery__image {
        width: 21%;
      }
    }
  `;

  @property({ type: Array })
  public urls: string[] = [];

  @property({ type: Number })
  public pageSize: number = config.DEFAULT_GALLERY_PAGE_SIZE;

  @property({ type: Number })
  public nonLazyImagesAmount: number = config.DEFAULT_NON_LAZY_IMAGES_COUNT;

  @state()
  private currentPage: number = 1;

  @queryAll('.gallery__image--lazy')
  private readonly lazyImages?: HTMLImageElement[];

  private readonly onScroll = (): void => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.currentPage++;
    }
  };

  public connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('scroll', this.onScroll);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this.onScroll);
  }

  private applyLazyLoading(): void {
    const imageObserver = new IntersectionObserver((entries): void => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          // Make sure all images have their urls set also in data-src
          // eslint-disable-next-line max-len
          // eslint-disable-next-line unicorn/prevent-abbreviations, @typescript-eslint/no-non-null-assertion
          image.src = image.dataset.src!;
          image.classList.remove('gallery-image--lazy');
          imageObserver.unobserve(image);
        }
      }
    });

    for (const image of this.lazyImages ?? []) {
      imageObserver.observe(image);
    }
  }

  public updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    this.applyLazyLoading();
  }

  public render(): TemplateResult {
    const currentlyDisplayedURLs = this.urls.slice(
      0,
      this.pageSize * this.currentPage,
    );

    return html`
      <div class="gallery">
        ${currentlyDisplayedURLs.map((url, index): TemplateResult => {
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
