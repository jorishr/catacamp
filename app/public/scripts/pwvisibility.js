//  toggle password visibility

let pwField = document.getElementById('pwField');
let icon = document.getElementById('pwIcon');

function passwordToggle(){
    if (pwField.type === 'password'){
        pwField.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        pwField.type = 'password';     
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');

    };
};