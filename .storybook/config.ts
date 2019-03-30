import { configure } from '@storybook/react';

function loadStories() {
  require('../client/ts/stories/Component.stories');
  require('../client/ts/stories/Forms.stories');
}

configure(loadStories, module);
