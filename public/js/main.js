let googleUser;

window.onload = (event) => {
    console.log("page loading")
    // Use this to retain user state between html pages.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            googleUser = user;
            document.querySelector("#welcome").innerHTML = "Welcome, "+ user.displayName.split(" ")[0];
        } else {
            window.location = 'index.html'; // If not logged in, navigate back to login page.
        }
    });
};