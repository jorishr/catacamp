const   mongoose    = require('mongoose'),
        Campground  = require('./models/campground'),
        Comment     = require('./models/comments');

let starterData = [
    {
        name:'Vall d\'Aran',
        image: 'images/2875977867.png',
        description: 'Beautiful lakes at great altitude. Great place for hiking and skying.'
    },
    {
        name:'La Mola',
        image: 'images/402270253.png',
        description: 'Good facilities. Excellent starting point for mountain biking.'
    },
    {
        name:'Delta de l\'Ebre',
        image: 'images/3837363146.png',
        description: 'You can camp on the beach here! Great seafood and lot\'s of water sport activities.'
    },
    {
        name:'Vall de Camprodon',
        image: 'images/31115219468.png',
        description: 'Nice historic town with traditional gastronomy. Lots of hiking oportunities in the region.'
    },
];

let dummyComment = {
    text: 'We had a great time there! Highly recommend campsite. Good price point too!',
    author: 'WhoKnows'
}

function seedBD(){
    Campground.deleteMany({}, (err) => {
        if(err){console.log('err');}
            else{
                console.log('All campgrouds succesfully DELETED from DB')
                    //  add starterData
                starterData.forEach((seed) => {
                    Campground.create(seed, (err, savedData) =>{
                        if(err){console.log('Error:', err)}
                            else {
                                console.log('Seed succesfully written to DB');
                                Comment.create(dummyComment, (err, savedComment) => {
                                    if(err){console.log('Error: ', err)}
                                        else {
                                            console.log('Comment stored succesfully in DB');
                                            savedData.comments.push(savedComment);
                                            savedData.save();
                                            console.log('Comment associated succesfully to: \n', savedData.name);
                                        };
                                });
                            };
                    });
                });
            };
    });
};

module.exports = seedBD;
