/*  toggle password visibility and change the icon 
    note: some forms have two pwfields (confirmation)   */
const icons = document.querySelectorAll('.password-box__icon');

export default function passwordToggle(){
    if(document.body.classList.contains('hasPw')){
        for(let i = 0; i < icons.length; i++){
            icons[i].addEventListener('click', function(){
                if (icons[i].previousElementSibling.type === 'password'){
                    icons[i].previousElementSibling.type = 'text';
                    icons[i].classList.remove('fa-eye');
                    icons[i].classList.add('fa-eye-slash');
                } else {
                    icons[i].previousElementSibling.type = 'password';     
                    icons[i].classList.remove('fa-eye-slash');
                    icons[i].classList.add('fa-eye');
                };
            })
        };
    }
};