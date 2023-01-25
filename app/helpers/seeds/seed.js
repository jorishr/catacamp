const   fs   = require('fs'),
        path = require("path"),
        { userService, campgroundService } = require('../../services/index'),
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


async function addCampgrounds(){
    console.log('Adding campgrounds from seed data.')
    const data = await loadSeedData(seedCampgrounds); 
    data.forEach(seed => {
        const newCampground = {
            name: seed.name,
            image: seed.image,
            price: seed.price, 
            description: seed.description, 
            author: {
                id: '63d174513bfb0a0027a0e2c5',
                username: ''
            }, 
            location: seed.location, 
            lat: seed.lat, 
            lng: seed.lng 
        }
        campgroundService.create(newCampground);
    });
    console.log('Database now has initial data to work with.')
}


async function hasInitData(){
    let hasUsers = await userService.getAllUsers()
    let hasCampgrounds = await campgroundService.getAll()
    if (hasUsers.length === 0){
        await addUsers();
    }
    if (hasCampgrounds.length === 0){
        await addCampgrounds();
    }
}

module.exports = {
    hasInitData,
};