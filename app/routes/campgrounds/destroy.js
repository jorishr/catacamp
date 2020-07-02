const   Campground  = require('../../models/campground'),
        express     = require('express'),
        router      = express.Router(),
        isCampgroundOwner  = require('../../middleware/isCampgroundOwner');

//  DESTROY ROUTE

//  associated comment deleting is handled as pre-hook Schema method in data model
router.delete('/:id', isCampgroundOwner, async (req, res, next) => {
    try {
        const currentCampground = await Campground.findById(req.params.id);
        currentCampground.remove();
        req.flash('success', 'Campground succesfully deleted!');
        return res.redirect('/campgrounds');
    } catch (err){
        err.shouldRedirect = true; 
        return next(err);
    }
});
module.exports = router;