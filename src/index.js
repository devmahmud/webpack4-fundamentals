import nav from './nav';
import { footer } from './footer';
import makeButton from './button';
import { makeColorStyle } from './button-styles';
import makeImage from './image';
import './button.css';
import logoUrl from './webpack-logo.png';
// import Foo from './foo.ts';

const button = makeButton('My first button!');
const image = makeImage(logoUrl);

button.style = makeColorStyle('magenta');
document.body.appendChild(button);
document.body.appendChild(footer);
document.body.appendChild(image);
