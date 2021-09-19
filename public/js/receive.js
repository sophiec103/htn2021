let googleUserId;
let name;
let messages = [];

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      name = user.displayName;
      googleUserId = user.uid;
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};

const getMessage = () => {
  const mesRef = firebase.database().ref(`messages`).orderByChild('title');
  mesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderDataAsHtml(data);
  });
};

const renderDataAsHtml = (data) => {
  let size = 0;
  for(const id in data) {
    const message = data[id];
    message.id = id;
    messages.push(message);
    size++;
  };

  let randomNum = Math.floor((Math.random() * size) + 1);
  let counter = 0;
  for (const key in messages) {
      counter++;
      if (counter==randomNum){
      const message = messages[key];
        document.querySelector("#mes-title").innerHTML = message.title;
        document.querySelector("#mes-content").innerHTML = createNewLine(message.content) + `<br><br><br><i>~${message.name}`;
    }    
  }
};

function createNewLine(text){
   let t = "";
   while (text.indexOf("\n")!=-1){ //replace all \n with <br>
       t = text.substring(0,text.indexOf("\n"));
       t += "<br>";
       t += text.substring(text.indexOf("\n")+1);
       text = t;
   }
   return text;
}

function getRandomColor() {
  return "hsl(" + Math.random() * 361 + ", 100%, 90%)"
}

function setRandomColor() {
  var style = document.createElement('style');
  style.innerHTML = `
  #id${counter} {
    background: ${getRandomColor()}
  }
  `;
  document.head.appendChild(style);
}
