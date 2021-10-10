// Setting basic parameters
let pageNr = 1;
const perPage = 10;
let totalPages = 0;
let colorMem = '';
let keywordsMem = '';
let orientationMem = '';

//Generate search for random header image
const body = document.querySelector('body');
const form = document.querySelector('form');

body.onload = async random => {
    random.preventDefault();

    const api_key = '23460168-a3df3e6db92ebd5ef518c87d1';

    const parameters = new URLSearchParams({
        key: api_key,
        per_page: 20,
        page: getRandomIntInclusive(1, 25),
    });
    const randomUrl = form.action + '?' + parameters;

    //Use the generated URL to fetch search results
    const response = await fetch(randomUrl);
    const jsonResponse = await response.json();
    randomImage(jsonResponse);
}

//Generate search url from user input
form.onsubmit = async event => {
    event.preventDefault();

    const api_key = '23460168-a3df3e6db92ebd5ef518c87d1'
    const keywords = form.elements.text.value;
    const color = form.elements.colors.value;
    const orientation = form.elements.orientation.value;

    const params = new URLSearchParams({
        key: api_key,
        q: keywords,
        colors: color,
        per_page: perPage,
        page: pageNr,
        orientation: orientation,
    });
    const url = form.action + '?' + params;

    colorMem = color;
    keywordsMem = keywords;
    orientationMem = orientation;
    
    // Clear previous content
    const main = document.querySelector('main');
    while(main.firstChild){
        main.removeChild(main.firstChild);
    }

    //Use the generated URL to fetch search results
    const response = await fetch(url);
    const jsonResponse = await response.json();
    showHits(jsonResponse);

    //Create content and popup
    function showHits(obj) {
        const myHits = obj['hits'];
        
        for (let i = 0; i < myHits.length; i++) {

            const mySearch = document.createElement('section');
            const myImage = document.createElement('img');
            const myUser = document.createElement('h2');
            const myTags = document.createElement('p');

            myImage.src = myHits[i].webformatURL;
            myUser.textContent = myHits[i].user;

            let tagsString = myHits[i].tags;
            let tagsArray = tagsString.trim().split(/\s*,\s*/);

            // Create tag buttons
            for (let t = 0; t < tagsArray.length; t++) {
                var b = document.createElement('button');
                b.setAttribute('value', tagsArray[t]);
                b.setAttribute('class', 'tagbtn');
                b.setAttribute('form', 'searchform');
                b.setAttribute('onclick', 'searchTag()')
                b.textContent = '#' + tagsArray[t];
                myTags.appendChild(b)
            }

            //Add content to main
            mySearch.appendChild(myImage);
            mySearch.appendChild(myUser);
            mySearch.appendChild(myTags);
            main.appendChild(mySearch);

            // Gets the popup
            var popup = document.getElementById("myPopup");

            // Get each image and insert inside popup
            var img = myImage;
            var popupImg = document.getElementById("img01");
            var captionText = document.getElementById("caption");
            img.onclick = function(){
                popup.style.display = "block";
                popupImg.src = myHits[i].largeImageURL;
                captionText.innerHTML = myTags.textContent;
            }

            // Get the <span> element that closes the popup
            var span = document.getElementsByClassName("close")[0];

            // Close popup
            span.onclick = function() {
            popup.style.display = "none";
            }
        }
    }

    // Button visibility controller
    totalPages = Math.ceil((Number(jsonResponse.totalHits))/perPage);

    if (pageNr >= totalPages) {
        document.getElementById('next').style.visibility = 'hidden';
        } 
        else {
            document.getElementById('next').style.visibility = 'visible';
    }
    if (pageNr <= 1) {
        document.getElementById('previous').style.visibility = 'hidden';
        } else {
            document.getElementById('previous').style.visibility = 'visible';
    }
};

// Page button controllers
document.getElementById('search').onclick = function() {
    pageNr = 1;
};

document.getElementById('previous').onclick = function() {
    pageNr -= 1;
    document.getElementById('searchbox').value = keywordsMem;
    document.getElementById('colorbox').value = colorMem;
    document.getElementById('orientationbox').value = orientationMem;
};

document.getElementById('next').onclick = function() {
    pageNr += 1;
    document.getElementById('searchbox').value = keywordsMem;
    document.getElementById('colorbox').value = colorMem;
    document.getElementById('orientationbox').value = orientationMem;
};

// Randomizer function
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//Random header function
function randomImage(obj) {
    const myHits = obj['hits'];
    const i = getRandomIntInclusive(0, 19);
    document.getElementById('headerBg').style.backgroundImage = "url('" + myHits[i].largeImageURL + "')";
}

// Tag button search function
function searchTag() {
    pageNr = 1;
    document.getElementById('colorbox').value = '';
    document.getElementById('orientationbox').value = 'all';
    document.getElementById('searchbox').value = event.target.value;
}
