import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

import { getFileUrl } from '../utils';

export type NewImageEventDetail = HTMLImageElement;

@customElement('upload-image')
export class UploadImage extends LitElement {
  public static styles = css`
    .upload-image__container {
      margin-top: 32px;
      text-align: center;
    }

    .upload-image__upload-image-img {
      width: 300px;
      margin-bottom: 16px;
    }
  `;

  @state()
  private uploadedImage: ArrayBuffer | string | null = null;

  @query('#upload-image-input')
  private readonly input?: HTMLInputElement | null;

  private readonly onChange = (): void => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!this.input || !this.input.files) {
      return;
    }

    void this.onNewFile(this.input.files[0]);
  };

  private async onNewFile(file: File): Promise<void> {
    const fileUrl = getFileUrl(file);

    void fileUrl.then((url): void => {
      if (url === null) {
        return;
      }

      this.uploadedImage = url;

      const img = document.createElement('img');
      // eslint-disable-next-line unicorn/prevent-abbreviations
      img.src = url;
      this.dispatchEvent(
        new CustomEvent<NewImageEventDetail>('new-image', {
          detail: img,
        }),
      );
    });
  }

  public render(): TemplateResult {
    if (this.uploadedImage !== null) {
      return html`
        <div class="upload-image__container">
          <div>
            <image
              src=${this.uploadedImage}
              alt="your photo"
              class="upload-image__upload-image-img"
            />
          </div>
          Upload again:
          <input
            class="upload-image__upload-image-input"
            id="upload-image-input"
            type="file"
            @change=${this.onChange}
          />
        </div>
      `;
    }

    return html`<div class="upload-image__container">
      <input
        class="upload-image__upload-image=input"
        id="upload-image-input"
        type="file"
        @change=${this.onChange}
      />
    </div>`;
  }
}
