// tslint:disable-next-line: no-reference
/// <reference path="./index.d.ts" /> #
// import css
import 'semantic-ui-css/semantic.min.css';
import 'vis-network/dist/vis-network.min.css';
import '../scss/main';
import '../scss/semanticui.override.scss';

import React from 'react';
import { render } from 'react-dom';

import App from './pages';

document.addEventListener('DOMContentLoaded', () => {
  render(<App />, document.getElementById('root'));
});
