function getTokenMailTemplate(user, host, token){
    const mailData = {
        to: user.email,
        from: 'CataCamp <catacamp@catacamp.com>',
        subject: 'CataCamp Password Reset',
        text: 
`Hello ${user.username},\n
You are receiving this email because you have requested the reset of the password for your account.\n 
Please click on the following link, or paste this into your browser to complete the process:\n 
\thttp://${host}/reset/${token}\n\n\n
If you did not request this change, please ignore this email and your password will remain unchanged.`
    }
    return mailData;
}

function getConfMailTemplate(user){
    const mailData = {
        to: user.email,
        from: 'CataCamp <catacamp@catacamp.com>',
        subject: 'Your CataCamp Password has changed',
        text: 
`Hello ${user.username},\n
This is a confirmation that the password for your account has been changed.\n\n\n
If this is what you intented, no further action is required.\n
If you did not initiate this change, please contact our support team.`
    }
    return mailData
}
module.exports = {
    getTokenMailTemplate,
    getConfMailTemplate   
}