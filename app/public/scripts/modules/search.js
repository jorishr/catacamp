// Pre-req: create a route that returns search results
// autocomplete search box sequence
// add event listener to search box
// construct search query regex
// fetch data from db (all at once or just matches? performance?)
// compare and return array of matches
// loop over matches and update DOM

const searchBox = document.querySelector('.search-box__text');

async function search(val){
    const displayResultsContainer = document.querySelector('.show-results')
    //route that returns search results
    //const res = await fetch(`campgrounds/search?search=${val}`)
    //const data = await res.json()
    //console.log(data)
    let data = [{name: 'La Mola', _id: 22333445}, {name: 'Camprodon', _id: 22333445}]
    // clear results container page
    displayResultsContainer.innerHTML = ''
    data.forEach(campground => {
        const str = getHtmlString(campground)
        displayResultsContainer.innerHTML += str
    })
}    

function getHtmlString(campground){
    let str = `
        <div class="index-grid card h-100">
            <figure>
                <img    class=""
                        src="/${campground.image}" alt="Image of the campground ${campground.name}">
            </figure>
            <div class="card-body">
                <h4 class="card-title text-muted">${campground.name}</h4>
            </div>
            <div class="card-footer">
                <a  href="/campgrounds/${campground._id}" title="CAMPGROUND PROFILE"
                    class="btn btn-outline-info">see more...<i class="fas fa-chevron-right pl-1"></i></a>
            </div>
        </div>` 
    return str
}


export default function listen(){
    if(document.getElementsByClassName('search-box').length !== 0){
        console.log('search box found')
        searchBox.addEventListener('input', () => {
            search(searchBox.value)
        })
    }
}