let googleUserId;
let name;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      name = user.displayName;
      googleUserId = user.uid;
      getMessages(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};

const getMessages = (userId) => {
  const mesRef = firebase.database().ref(`messages`).orderByChild('author');
  mesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderDataAsHtml(data);
  });
};

  let messages = [];
const renderDataAsHtml = (data) => {
  let messagesHtml = ``;
  messages = [];
  for(const id in data) {
    const message = data[id];
    console.log(message.author);
    if(message.author == (googleUserId)){
        message.id = id;
        messages.push(message);
        console.log("here");
    }
  };

  for (const key in messages) {
      const message = messages[key];

        messagesHtml += createCard(message, message.id);
        setRandomColor();   
  }

  // Inject our string of HTML into mymessages.html page
  document.querySelector('.columns').innerHTML = messagesHtml;
  console.log(messagesHtml);
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

let counter = 0;
const createCard = (message, id) => {
   counter++;
   const text = createNewLine(message.content);
   let s = ``;
   s += `
     <div class="column is-one-fifth">
       <div class="card" id="id${counter}">
         <div class="card-content">
           <div class="content"><b>${message.title}</b> 
           <p>&nbsp</p>
           ${text}</div>
            <div class="content"><i>~${message.created}</i></div>
           </div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;           
            <button class="button is-outlined is-dark is-small"
                onclick = "editMessage('${id}')">
                Edit
           </button>
           <button class="button is-outlined is-dark is-small"
                onclick = "deleteNote('${id}')">
                Delete
           </button>
           <p>&nbsp</p>
       </div>
     </div>
   `;
   return s;
};

function deleteNote(id){
    if (confirm("Are you sure you want to delete this note?")){
      firebase.database().ref(`messages/${id}`).remove();
    }
}

const editMessage = (id) => {
  const editModal = document.querySelector('#editModal');
  const notesRef = firebase.database().ref(`messages/${id}`);
  notesRef.on('value', (snapshot) => {
    const message = snapshot.val();
    document.querySelector('#editTitle').value = message.title;
    document.querySelector('#editText').value = message.content;
    document.querySelector('#id').value = id;
  });
  editModal.classList.toggle('is-active');
};

function saveMessage(){
    const title = document.querySelector('#editTitle').value;
    const text = document.querySelector('#editText').value;
    const id = document.querySelector('#id').value;
    const editedNote = {title, text}; //shorted way for above when the var names are repeated
    firebase.database().ref(`messages/${id}`).update(editedNote);
    closeEditModal();
}

function closeModal(){
  const editModal = document.querySelector('#editModal');
  editModal.classList.toggle('is-active');
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