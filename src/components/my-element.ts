import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('my-element')
export class MyElement extends LitElement {
  public static readonly styles = css`
    .container {
      position: relative;
      display: block;
    }
  `;

  public render = (): TemplateResult =>
    html`<div class="container">Hello from MyElement!</div>`;
}
