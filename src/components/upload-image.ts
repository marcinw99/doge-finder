import { LitElement, css, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

import { getFileUrl } from '../utils';

export type NewImageEventDetail = HTMLImageElement;

@customElement('upload-image')
export class UploadImage extends LitElement {
  static styles = css`
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
  uploadedImage: string | ArrayBuffer | null = null;

  @query('#upload-image-input')
  input?: HTMLInputElement;

  onChange() {
    if (!this.input || !this.input.files) {
      return;
    }
    this.onNewFile(this.input.files[0]);
  }

  async onNewFile(file: File) {
    const fileUrl = getFileUrl(file);

    fileUrl.then((url) => {
      if (!url) {
        return;
      }

      this.uploadedImage = url;

      const img = document.createElement('img');
      img.src = url;
      this.dispatchEvent(
        new CustomEvent<NewImageEventDetail>('new-image', {
          detail: img,
        }),
      );
    });
  }

  render() {
    if (this.uploadedImage) {
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
