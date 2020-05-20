import {html, render} from "./web_modules/lit-html.js";

let sites = {
    'src': 'https://github.com/tmcmaster/tm-firebase-functions',
    'pika': 'https://www.pika.dev/npm/@wonkytech/tm-firebase-functions',
    'npm': 'https://www.npmjs.com/package/@wonkytech/tm-firebase-functions',
    'docs': 'https://github.com/tmcmaster/tm-firebase-functions#readme'
};

render(html`
    <style>
        body {
          padding: 0;
          margin: 0;
        } 
    </style>
    <tm-examples heading="tm-firebase-functions" .sites="${sites}">
        <section title="Example">
            <tm-firebase-functions></tm-firebase-functions>
        </section>
    </tm-examples>
`, document.querySelector('body'));