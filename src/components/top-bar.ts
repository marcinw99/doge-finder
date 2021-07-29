import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('top-bar')
export class TopBar extends LitElement {
  public static styles = css`
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 8px;
      box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.3);
      background: #fff;
    }

    .top-bar__app-name {
      margin: 0 0 0 16px;
      font-size: 24px;
    }
  `;

  // eslint-disable-next-line class-methods-use-this
  public render(): TemplateResult {
    return html` <div class="top-bar">
      <img src="src/assets/doge-logo.png" width="50" height="50" />
      <h6 class="top-bar__app-name">Doge Finder</h6>
    </div>`;
  }
}
