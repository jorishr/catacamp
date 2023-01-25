const   fs          = require('fs'),
        { userService, campgroundService } = require('../../services/index')
        seedUsers         = 'seedUsers.json',
        seedCampgrounds   = 'seedCampgrounds.json',
        seedComments      = 'seedComments.json';
        
        
function loadSeedData(file){
    const rawData = fs.readFileSync(file)
    return JSON.parse(rawData);
}

async function addUsers(){
    data = await loadSeedData(seedUsers);
    data.forEach(user => {
        try {
            userService.register({
                username:      user.username,
                firstname:     user.firstName,
                lastname:      user.lastName,
                email:         user.email,
                dateOfBirth:   user.dateOfBirth,
                isAdmin:       user.isAdmin      
            }, 
            user.password)
        } catch (e) {
            return e
        }
    })
}


async function addCampgrounds(){
    const data = await loadSeedData(seedCampgrounds);
    //const commentSeed = loadSeedData(seedComments) 
    data.forEach(seed => {
        user = getAuthor();
        const newCampground = {
            name: seed.name,
            image: seed.image,
            price: seed.price, 
            description: seed.description, 
            author: {
                id: {id: user._id},
                username: user.username
            }, 
            location: seed.location, 
            lat: seed.lat, 
            lng: seed.lng 
        }
        campgroundService.create(newCampground);
    })
}

async function getAuthor(){
    user = await userService.findByUsername('admin')
    return 
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