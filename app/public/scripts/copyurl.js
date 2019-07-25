//  copy current page url to clipboard and show a tooltip confirmation
const   dummy = document.createElement('input'),
        text = window.location.href;

let shareBtn = document.getElementsByClassName('share-link');
let tooltip = document.getElementsByClassName('tooltip-link');

//  getElementByClassName is a collection, array of elements
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