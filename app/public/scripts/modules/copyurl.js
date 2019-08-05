//  copy current page url to clipboard and show a tooltip confirmation
const   dummy       = document.createElement('input'),
        text        = window.location.href,
        shareBtn    = document.querySelector('.share-link'),
        tooltip     = document.querySelector('.tooltip-link');

/*  check if page has share btns via class added to the body on that page   */
export default function addCopyUrl() {
    if(document.body.classList.contains('hasShare')){
        shareBtn.addEventListener('click', (event) => {
            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            tooltip.classList.add('tooltip-link--visible');
            setTimeout(() => {
                tooltip.classList.remove('tooltip-link--visible');
            }, 3000);
        });
    };
};