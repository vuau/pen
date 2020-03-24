import 'tachyons';
import 'material-design-icons/iconfont/material-icons.css';
import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    name: 'Somewhere'
  }
});

export default app;
