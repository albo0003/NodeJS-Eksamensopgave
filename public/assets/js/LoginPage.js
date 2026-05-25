const userLoggedIn = document.getElementById("UserLoggedIn")

const popUpText = document.getElementById("PopUpText")
const usernameInput = document.getElementById("Username")
const passwordInput = document.getElementById("Password")
const passwordAgainInput = document.getElementById("PasswordAgain")


const loginButton = document.getElementById("LoginButton")
const signupButton = document.getElementById("SignupButton")

const logOutButton = document.getElementById("LogOutButton")

//popup
const openLoginButton = document.getElementById("OpenLoginButton")
const openSignUpButton = document.getElementById("OpenSignUpButton")


const closePopupButton = document.getElementById("ClosePopupButton")

function openPopup(dontDisplay, display, text) {
    dontDisplay.map((element) => {
        element.style.display = "none"
    })
    display.map((element) => {
        element.style.display = "block"
    })
    popUpText.innerText = text;
  document.getElementById("PopUp").style.display = "block"
}

function closePopup() {
  document.getElementById("PopUp").style.display = "none"
}

openLoginButton.addEventListener("click", () => openPopup([passwordAgainInput, signupButton], [loginButton], "Login"))
openSignUpButton.addEventListener("click", () => openPopup([loginButton], [passwordAgainInput, signupButton], "Sign Up"))
closePopupButton.addEventListener("click", closePopup)

//fetch

async function getSession() {
    const res = await fetch("/me");
    const data = await res.json();

    if(data.username){
        userLoggedIn.innerText += data.username ? data.username : ""

        openLoginButton.style.display = "none"
        openSignUpButton.style.display = "none"
    }
    else{
        logOutButton.style.display = "none"
    }
    
}
getSession();

async function Login(){
     if(!passwordInput.value ||!usernameInput.value){
        alert("Must fill out all spaces")
        return
    }
    const response = await fetch('/auth/login', {
        method: "POST",
        body: JSON.stringify({ 
            username: usernameInput.value, 
            password: passwordInput.value
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })

    if(response.status === 404){
        alert("Not Right Username Or Password")
    }
    else if(response.status === 429){
        alert("too many request, timed out for 10 min")
    }
    else{
        const data = await response.json()

        
        closePopup()
        window.location.reload();
    }

    
}

async function SignUp(){
    if(!passwordAgainInput.value ||!passwordInput.value ||!usernameInput.value){
        alert("Must fill out all spaces")
        return
    }
    if(passwordAgainInput.value != passwordInput.value){
        alert(`"Password" and "Password Again" has to be the same`)
        return
    }

    const response = await fetch('/auth/signup', {
        method: "POST",
        body: JSON.stringify({ 
            username: usernameInput.value, 
            password: passwordInput.value,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await response.json()

    if(response.status === 429){
        alert("too many request, timed out for 10 min")
    }
    //already exists username in db
    if(response.status === 404){
        alert(data.data)
    }
    else{
        
        closePopup()
        window.location.reload();
    }

    
}

async function SignOut(){
    await fetch("/auth/signout");
    window.location.reload();
}



loginButton.addEventListener("click", Login)
signupButton.addEventListener("click", SignUp)

logOutButton.addEventListener("click", SignOut)