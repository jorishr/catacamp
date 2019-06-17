const   path = require('path'),
        express = require('express'),
        app = express(),
        port = 3000,
        bodyParser = require('body-parser');
        
//  basic express configuration

app.listen(port, () => console.log(`Express Server is listening on port ${port}`));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//  ========
//  ROUTES
//  ========

app.get('/', (req, res) => {
    res.render('home')
});

let campgrounds = [
    // filepaths: Express already looks in public folder by default
    {name: 'Salmon Creek', img:'images/2164766085.png'},    
    {name: 'Mountain Range', img:'images/2602356334.png'},
    {name: 'Granite Hill', img:'images/7121865553.png'},
];

app.get('/campgrounds', (req, res) => {
    res.render('campgrounds', {campgrounds:campgrounds})
});

app.post('/campgrounds', (req, res) => {
    // get data from form and add to campgrounds array
    let newName = req.body.newName;
    let newImage = req.body.newImage;
    let newCampground = {name: newName, img: newImage};
    campgrounds.push(newCampground);
    // redirect to campgrounds page
    res.redirect('campgrounds');
});

//  page where new campground can be submitted
app.get('/campgrounds/new', (req, res) => {
    res.render('new-campground');
});