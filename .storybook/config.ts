import { configure } from '@storybook/react';

function loadStories() {
  require('../client/ts/stories/Menu.stories');
  require('../client/ts/stories/Forms.stories');
}

configure(loadStories, module);
