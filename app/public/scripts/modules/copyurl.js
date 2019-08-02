//  copy current page url to clipboard and show a tooltip confirmation
const   dummy       = document.createElement('input'),
        text        = window.location.href,
        shareBtn    = document.getElementsByClassName('share-link'),
        tooltip     = document.getElementsByClassName('tooltip-link');

/*  check if page has share btns via class added to the body on that page   */
function addCopyUrl() {
    if(document.body.classList.contains('hasShare')){
        shareBtn[0].addEventListener('click', (event) => {
            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            tooltip[0].classList.add('tooltip-link--visible');
            setTimeout(() => {
                tooltip[0].classList.remove('tooltip-link--visible');
            }, 3000);
        });
    };
};
module.exports = addCopyUrl;