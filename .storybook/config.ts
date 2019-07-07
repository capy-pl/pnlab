import { configure } from '@storybook/react';

function loadStories() {
  require('../client/ts/stories/Menu.stories');
  require('../client/ts/stories/Forms.stories');
  require('../client/ts/stories/Graph.stories');
  require('../client/ts/stories/Dropdown.stories');
  require('../client/ts/stories/List.stories');
  require('../client/ts/stories/Message.stories');
}

configure(loadStories, module);
