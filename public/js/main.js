let googleUser;

window.onload = (event) => {
    console.log("page loading")
    // Use this to retain user state between html pages.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            googleUser = user;
            const userData = firebase.database().ref(`users/${user.uid}`);
            userData.on('value', (snapshot) => {
                const data = snapshot.val();
                console.log(data)
                for (const id in data) {
                    if(id == "name"){
                        document.querySelector("#welcome").innerHTML = "Welcome, "+ data[id];
                    }
                }
                updateCards();
            });
        } else {
            window.location = 'index.html'; // If not logged in, navigate back to login page.
        }
    });
};