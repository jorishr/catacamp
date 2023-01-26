/* 
*  Main JS is loaded on all pages but some of the code should only run on specific pages. Those pages have a special class added to the body tag.
*/

import addCopyUrl from './modules/copyurl';
import passwordToggle from './modules/pwvisibility';
import disableSubmit from './modules/form';
import listen from './modules/search';

addCopyUrl();
passwordToggle();
disableSubmit();
listen();