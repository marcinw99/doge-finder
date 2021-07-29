import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('top-bar')
export class TopBar extends LitElement {
  static styles = css`
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 8px;
      border-bottom: 1px solid black;
    }
    
    .top-bar__app-name {
      margin: 0 0 0 16px;
      font-size: 24px;
    }
  `;

  render() {
    return html` <div class="top-bar">
      <img src="src/assets/doge-logo.png" width="50" height="50" />
      <h6 class="top-bar__app-name">Doge Finder</h6>
    </div>`;
  }
}
