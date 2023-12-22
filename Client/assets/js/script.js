const urlApi = 'http://localhost:3000/';

document.addEventListener('DOMContentLoaded', () => {
    
    let btnRegister = document.querySelector('#register-page button');
    let btnLogin = document.querySelector('#login-page button');
    let btnAddProduct = document.querySelector('#formProducts button');

    if(btnRegister){
        btnRegister.addEventListener('click', registerEvent)
    } else if(btnLogin){
        btnLogin.addEventListener('click', loginEvent)
    } else if(btnAddProduct){
        btnAddProduct.addEventListener('click', addProductEvent)
    }
    
    getUserLog();
})

function getUserLog() {
    let loggedIn = localStorage.getItem('UserLog')
    if(loggedIn){
        let userLog = JSON.parse(loggedIn);
        let logNav = document.querySelector('#logNav');
        logNav.innerHTML = '';
        logNav.innerText = 'Ciao ' + userLog.user.firstname + ' ' + userLog.user.lastname

        // <button type="button" class="btn btn-outline-warning">Warning</button>
        let logOutBtn = document.createElement('button');
        logOutBtn.setAttribute('type', "button")
        logOutBtn.className = "btn btn-sm btn-outline-warning ms-3"
        logOutBtn.innerText = 'Logout';
        logOutBtn.addEventListener('click', () => {
            localStorage.removeItem('UserLog');
            window.location = 'index.html';
        })
        logNav.appendChild(logOutBtn);

        // Creo la voce di menu Admin
        /*
            <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="index.html">Admin</a>
            </li>
        */
        let li = document.createElement('li');
        li.className = "nav-item"
        let a = document.createElement('a');
        a.className = "nav-link";
        a.href = "admin.html";
        a.setAttribute('aria-current', "page");
        a.innerText = 'Admin';
        li.appendChild(a);
        document.querySelector('#navbarText ul').appendChild(li);
    }
}


function registerEvent(e) {
    e.preventDefault();
    let firstname = document.querySelector('#register-page input#firstname').value.trim();
    let lastname = document.querySelector('#register-page input#lastname').value.trim();
    let city = document.querySelector('#register-page input#city').value.trim();
    let email = document.querySelector('#register-page input#email').value.trim();
    let password = document.querySelector('#register-page input#password').value.trim();

    //console.log(firstname, lastname, city, email, password);
    let obj = {
        firstname,
        lastname,
        city,
        email,
        password
    }
    fetch(urlApi+'register', {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(obj) })
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(err => console.log(err))
}

function loginEvent(e) {
    e.preventDefault();
    let email = document.querySelector('#login-page input#email').value.trim();
    let password = document.querySelector('#login-page input#password').value.trim();
    fetch(urlApi+'login', {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({
                email,
                password
            }) })
        .then(response => response.json())
        .then(json => statusResponse(json))
        .catch(err => console.log(err))
}

function addProductEvent(e){
    let marca = document.querySelector('#formProducts input[name="marca"]').value.trim();
    let modello = document.querySelector('#formProducts input[name="modello"]').value.trim();
    let categoria = document.querySelector('#formProducts input[name="categoria"]').value.trim();
    let prezzo = document.querySelector('#formProducts input[name="prezzo"]').value.trim();
    let quantita = document.querySelector('#formProducts input[name="quantita"]').value.trim();
    let immagine = document.querySelector('#formProducts input[name="immagine"]').value.trim();

    //console.log(marca, modello, categoria, prezzo, quantita, immagine);

    let obj = {
        marca,
        modello,
        categoria,
        prezzo,
        quantita,
        immagine
    }

    fetch(urlApi+'products', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(err => console.log(err))
    
}

function statusResponse(response) {
    /* <div class="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>Holy guacamole!</strong> You should check in on some of those fields below.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    */
    let form = document.querySelector('#login-page form');
    form.lastElementChild.role !== null ? form.removeChild(form.lastElementChild) : null;

    let alertDiv = document.createElement('div');
    alertDiv.setAttribute('role', "alert")
    alertDiv.className = "alert alert-dismissible fade show mx-3";
    
    if(response.accessToken){
        alertDiv.classList.add('alert-success');
        alertDiv.innerText = "Logged In!!"
        document.querySelector('#login-page input#email').value = '';
        document.querySelector('#login-page input#password').value = '';

        localStorage.setItem('UserLog', JSON.stringify(response))
        getUserLog();
    } else {
        alertDiv.classList.add('alert-danger');
        alertDiv.innerText = response
    }

    let alertBtn = document.createElement('button');
    alertBtn.className = "btn-close";
    alertBtn.setAttribute('type', "button");
    alertBtn.setAttribute('data-bs-dismiss', "alert");
    alertBtn.setAttribute('aria-label', "Close");
    alertDiv.appendChild(alertBtn);

    document.querySelector('#login-page form').appendChild(alertDiv);
}