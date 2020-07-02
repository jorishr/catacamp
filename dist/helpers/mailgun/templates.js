function getTokenMailTemplate(e,t,a){return{to:e.email,from:"CataCamp <catacamp@catacamp.com>",subject:"CataCamp Password Reset",text:`Hello ${e.username},\n\nYou are receiving this email because you have requested the reset of the password for your account.\n \nPlease click on the following link, or paste this into your browser to complete the process:\n \n\thttp://${t}/reset/${a}\n\n\n\nIf you did not request this change, please ignore this email and your password will remain unchanged.`}}function getConfMailTemplate(e){return{to:e.email,from:"CataCamp <catacamp@catacamp.com>",subject:"Your CataCamp Password has changed",text:`Hello ${e.username},\n\nThis is a confirmation that the password for your account has been changed.\n\n\n\nIf this is what you intented, no further action is required.\n\nIf you did not initiate this change, please contact our support team.`}}module.exports={getTokenMailTemplate:getTokenMailTemplate,getConfMailTemplate:getConfMailTemplate};