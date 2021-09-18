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
        document.querySelector("#mes-content").innerHTML = message.content;
        console.log(message.title);
        setRandomColor();
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

let counter = 0;
const createCard = (note, id) => {
   counter++;
   const text = createNewLine(note.text);
   let s = ``;
   s += `
     <div class="column is-one-quarter">
       <div class="card" id="id${counter}">
         <header class="card-header">
           <p class="card-header-title">${note.title}</p>
         </header>
         <div class="card-content">
           <div class="content">${text}</div>
            `

    for (let i = 0; i<note.labels.length; i++){
        s += `<span class="tag is-light is-info"> 
                ${note.labels[i]}
              </span> &nbsp`
    }

    s += ` <div class="content"><i>Created by ${name} <br> on ${note.created}</i></div>
           </div>
         <footer class = "card-footer">
            <a 
                href = "#" 
                class = "card-footer-item" 
                onclick = "editNote('${id}')">
                Edit
           </a>
           <a 
                href = "#" 
                class = "card-footer-item" 
                onclick = "archiveNote('${id}')">
                Archive
           </a>
           <a  
                href = "#" 
                class = "card-footer-item" 
                onclick = "deleteNote('${id}')">
                Delete
           </a>
         </footer>
       </div>
     </div>
   `;
   return s;
};

function deleteNote(id){
    if (confirm("Are you sure you want to delete this note?")){
      firebase.database().ref(`users/${googleUserId}/${id}`).remove();
    }
}

const editNote = (id) => {
  const editNoteModal = document.querySelector('#editNoteModal');
  const notesRef = firebase.database().ref(`users/${googleUserId}/${id}`);
  notesRef.on('value', (snapshot) => {
    // const data = snapshot.val();
    // const noteDetails = data[noteId];
    // document.querySelector('#editTitleInput').value = noteDetails.title;
    // document.querySelector('#editTextInput').value = noteDetails.text;
    const note = snapshot.val();
    document.querySelector('#editTitleInput').value = note.title;
    document.querySelector('#editTextInput').value = note.text;
    let labels = "";
    for (let i = 0; i<(note.labels).length-1; i++){
        labels += note.labels[i] + ", ";
    }
    labels += note.labels[(note.labels).length-1];
    document.querySelector('#editLabelInput').value = labels;
    document.querySelector('#messageId').value = id;
  });
  editNoteModal.classList.toggle('is-active');
};

function saveEditedNote(){
    const title = document.querySelector('#editTitleInput').value;
    const text = document.querySelector('#editTextInput').value;
    const label = document.querySelector('#editLabelInput').value;
    const messageId = document.querySelector('#messageId').value;
    // const editedNote = {
    //     title: title,
    //     text: text
    // }
    labels = label.split(", ");
    const editedNote = {title, text, labels}; //shorted way for above when the var names are repeated
    firebase.database().ref(`messages/${noteId}`).update(editedNote);
    closeEditModal();
}

function closeEditModal(){
  const editNoteModal = document.querySelector('#editNoteModal');
  editNoteModal.classList.toggle('is-active');
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
