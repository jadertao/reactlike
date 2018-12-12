import { render, createElement } from '../src';
import { timer } from './timer';

const rootDom = document.getElementById('host');
timer(rootDom);