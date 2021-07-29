import { LitElement, css, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

import { getFileUrl } from '../utils';

export type NewImageEventDetail = HTMLImageElement;

@customElement('upload-image')
export class UploadImage extends LitElement {
  static styles = css``;

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
        <image
          src=${this.uploadedImage}
          alt="your photo"
          class="upload-image-img"
        />
      `;
    }

    return html`<input
      class="upload-image"
      id="upload-image-input"
      type="file"
      @change=${this.onChange}
    /> `;
  }
}
