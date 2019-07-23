const   dummy = document.createElement('input'),
        text = window.location.href;

const shareBtn = document.querySelector('.share-link');

shareBtn.addEventListener('click', (event) => {
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
});