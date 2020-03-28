import Gun from 'gun/gun';
import 'gun/sea';

const gun = Gun(['https://somewhere-on-heroku.herokuapp.com/gun']);
window.gun = gun;

export { gun };

