let language = document.documentElement.lang;
    
async function headerSetup() {
    try {
        const response = await fetch(`../${language}/header.html`);
        let headerText = await response.text();
        let clearHeaderText = headerText.replace('</body>','');
        document.querySelector('header').innerHTML = clearHeaderText;
    }   
    catch (error) {
        console.error(error);
    };
}

function footerSetup() {
    fetch(`../${language}/footer.html`)
        .then(response => {
            return response.text();
        })
        .then(data => {
            document.querySelector('footer').innerHTML = data;
        });
}

async function languageDropdownSetup() {
    document.getElementById('dropdown-button').addEventListener('click', (event) => {
        let dropdownContent = document.getElementsByClassName('dropdown-content')[0];
        
        if (dropdownContent.style.display == 'none') {
            dropdownContent.style.display = 'block';
            document.getElementsByClassName('dropdown-button')[0].classList.add('selected');
        }
        else 
        {
            dropdownContent.style.display = 'none';
            document.getElementsByClassName('dropdown-button')[0].classList.remove('selected');
        }
    });

    let dropdownItems = document.getElementsByClassName('dropdown-item');
    for (let i = 0; i < dropdownItems.length; i++) {
        dropdownItems[i].addEventListener('click', (event) => {
            let pos = (window.location.pathname.indexOf('/', 1));
            let pathEnd = (window.location.pathname.slice(pos+1));
            let newHref = `${window.location.origin}/${event.target.attributes[1].value}/${pathEnd}`;

            window.location.href = newHref;
        });
    };
}

async function menuDropDownSetup() {
    var dropdownContent = document.querySelector('.nav-bar-grouped');
    dropdownContent.style.display = window.getComputedStyle(dropdownContent).display;
    document.querySelector('.nav-menu-small-button-container').addEventListener('click', (event) => {
        if (dropdownContent.style.display == "none") {
            dropdownContent.style.display = "flex";
        } else {
            dropdownContent.style.display = "none";
        }
    });

    const mql = window.matchMedia("(width >= 768px)");
    mql.addEventListener("change", (event) => {
        if (event.matches) {
            dropdownContent.style.display = "none";
        } else {
            // console.log("width < 768px");
        }
    });
}

async function initialSetup() {
    await headerSetup();
    await footerSetup();
    languageDropdownSetup();
    menuDropDownSetup();
    
}

// console.log(document.querySelector('html').clientWidth);

initialSetup();