//  exclude delete btns
let fields = document.querySelectorAll('input[required], textarea')
let submit = document.querySelector('form > button:not(.delete)');

export default function disableSubmit(){
    if(fields.length !== 0){
        submit.disabled = true;
        for(let i = 0; i < fields.length; i++){
            fields[i].addEventListener('input', function(){
                let values = []
                fields.forEach(field => values.push(field.value))
                submit.disabled = values.includes('');
            })
        };        
    };
};