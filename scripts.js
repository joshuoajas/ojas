const btn = document.getElementById('btn-shorten')
const link = document.getElementById('link')
const errorMsg = document.getElementById('error-msg')
const form = document.getElementById('shorten-form')
const URL_API = 'https://rel.ink/api/links/'
const URLContainer = document.getElementById('short-url-container')
const burger = document.getElementById('burger');
const navMenu = document.getElementById('nav-menu')
const short_urls = 'short-urls'

//Eventlisteners

document.addEventListener('DOMContentLoaded', getLocal);

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let linkText = link.value.trim();
    if (validateLink(linkText)) {
        const res = await getShortenedUrl(linkText);
        const newURL = `https://rel.ink/${res.hashid}`;
        addResult(res.url, newURL);
        addLocal(res.hashid, res.url);
        link.value = '';
    };
});

burger.addEventListener('click', () => {
    burger.classList.toggle("burger-toggle");
    navMenu.classList.toggle("hide");
})

//Functions

function is_url(str)
{
  regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (regexp.test(str))
        {
          return true;
        }
        else
        {
          return false;
        }
}


//Validate link
function validateLink(lnk) {
    if (lnk === '') {
        errorMsg.textContent = "Please add a link";
        errorMsg.classList.remove("nondisplay");
        errorMsg.classList.add("displayflex");
        link.classList.add("red-border");
        return false;
    }
    else {
        if (!is_url(lnk))
            {
                errorMsg.textContent = "Please add a valid link";
                errorMsg.classList.remove("nondisplay");
                errorMsg.classList.add("displayflex");
                link.classList.add("red-border");
                return false;
            }
            else {
                errorMsg.classList.add("nondisplay");
                errorMsg.classList.remove("displayflex");
                link.classList.remove("red-border");
                return true;
            }
    }
}

// POST URL
async function getShortenedUrl(url) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    let body = JSON.stringify({ url: `${url}` });
    let requestOptions = {
      method: 'POST',
      headers,
      body
    };
    const response = await fetch(URL_API, requestOptions);
    const data = await response.json();
    return data;
  }

//Create div for result
function addResult (link, shortLink) {
    URLContainer.appendChild(document.createElement("div"));
    const divArray = URLContainer.getElementsByTagName("div");
    const curDiv = divArray[divArray.length-1];
    curDiv.classList.add("url-result");
    curDiv.appendChild(document.createElement("span"));
    curDiv.appendChild(document.createElement("span"));
    curDiv.getElementsByTagName("span")[0].classList.add("full-url");
    curDiv.getElementsByTagName("span")[0].textContent = link;
    curDiv.getElementsByTagName("span")[1].classList.add("short-url");
    curDiv.getElementsByTagName("span")[1].textContent = shortLink;
    curDiv.appendChild(document.createElement("button"));
    const curBtn = curDiv.querySelector("button");
    curBtn.classList.add("btn-copy");
    curBtn.innerText = "Copy";
    curBtn.addEventListener('click', () => {
        const div = curBtn.parentElement;
        const textArea = document.createElement('textarea');
        textArea.value = div.getElementsByTagName("span")[1].innerText;
        textArea.style.color="transparent";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        curBtn.innerText = "Copied!";
        curBtn.style.backgroundColor = "hsl(260, 8%, 14%)";
        setTimeout(() => {
            curBtn.innerText = "Copy";
        curBtn.style.backgroundColor = "hsl(180, 66%, 49%)";
        }, 2000);
    })
}

//Add to local storage

function addLocal (hash, url) {
    const cards = localStorage.getItem(short_urls);
    if (cards) {
        const urls = JSON.parse(cards);
        const check = urls.find(({hashid}) => hashid === hash);
        if (!check) {
            urls.push({hashid: hash, url});
            localStorage.setItem(short_urls, JSON.stringify(urls));
        }
    }
    else {
        const urls = [];
        urls.push({hashid: hash, url});
        localStorage.setItem(short_urls, JSON.stringify(urls));
    }
}

//Get from local storage

function getLocal () {
    const cards = localStorage.getItem(short_urls);
    if (cards) {
        const urls = JSON.parse(cards);
        urls.map(data => {
            addResult(data.url, `https://rel.ink/${data.hashid}`);
        })
    }
}