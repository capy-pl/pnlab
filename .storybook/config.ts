import { configure } from '@storybook/react';

function loadStories() {
  require('../client/ts/stories/Menu.stories');
  require('../client/ts/stories/Forms.stories');
  require('../client/ts/stories/Graph.stories');
  require('../client/ts/stories/Dropdown.stories');
  require('../client/ts/stories/List.stories');
  require('../client/ts/stories/Message.stories');
  require('../client/ts/stories/Input.stories');
  require('../client/ts/stories/Sidebar.stories');
}

configure(loadStories, module);
