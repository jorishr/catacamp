module.exports = function mailTemplate(user, host, token){
    const mailData = {
        to: user.email,
        from: 'CataCamp <catacamp@catacamp.com>',
        subject: 'CataCamp Password Reset',
        text: 
    `Hello CataCamp user,\n
    You are receiving this because you (or someone else) have requested the reset of the password for your account.\n 
    Please click on the following link, or paste this into your browser to complete the process:\n 
    \thttp://${host}/reset/${token}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.`
    }
    return mailData;
}