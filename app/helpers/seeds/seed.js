const   fs   = require('fs'),
        path = require("path"),
        { userService, campgroundService, commentService } = require('../../services/index'),
        seedUsers         = 'seedUsers.json',
        seedCampgrounds   = 'seedCampgrounds.json',
        seedComments      = 'seedComments.json';
        
     
function loadSeedData(file){
    const rawData = fs.readFileSync(path.resolve(__dirname, file))
    return JSON.parse(rawData);
}

async function addUsers(){
    console.log('Adding users from seed data.')
    data = await loadSeedData(seedUsers);
    data.forEach(user => {
        try {
            userService.register({
                username:      user.username,
                firstname:     user.firstname,
                lastname:      user.lastname,
                email:         user.email,
                dateOfBirth:   new Date(),
                isAdmin:       user.isAdmin      
            }, 
            user.password)
        } catch (e) {
            return e
        }
    })
}


async function getUser(){
    return await userService.findByUsername('admin');
}


async function addCampgrounds(){
    console.log('Adding campgrounds from seed data.')
    const campData = await loadSeedData(seedCampgrounds); 
    const comment  = await loadSeedData(seedComments); 
    await getUser().then(usr => {
        campData.forEach(seed => {
            const newCampground = {
                name: seed.name,
                image: seed.image,
                price: seed.price, 
                description: seed.description, 
                author: {
                    id: usr._id,
                    username: 'admin'
                }, 
                location: seed.location, 
                lat: seed.lat, 
                lng: seed.lng 
            }
            campgroundService.create(newCampground).then((savedCampground) => {
                commentService.create(comment).then(savedComment => {
                    savedCampground.comments.push(savedComment);
                    savedCampground.save();
                })
            })
        })
    })
    console.log('Database now has initial data to work with.')
}


async function hasInitData(){
    let hasUsers = await userService.getAllUsers()
    let hasCampgrounds = await campgroundService.getAll()
    if (hasUsers.length === 0){
        await addUsers();
    }
    if (hasCampgrounds.length === 0){
        //  wait 5 seconds for users to be added into the database
        setTimeout( () => {addCampgrounds()}, 5000);     
    }
}

module.exports = {
    hasInitData,
    getUser
};