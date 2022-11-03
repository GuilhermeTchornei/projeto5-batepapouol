let user;
const mainContainer = document.querySelector("main");
const input = document.querySelector("textarea");
const sendingTo = document.querySelector(".sendingTo")
const sideBar = document.querySelector(".sidebar");
let contacts = document.querySelector(".contacts");
let contactElementSelected = document.querySelector(".contacts .selected");
let visibilityElementSelected = document.querySelector(".visibility .selected");
let contactName = "Todos";
let visibilitySelected = "Público";


enterRoom();
//getContacts();
//setSendingTo();
function enterRoom() {
    user = { name: prompt("Qual seu lindo nome?") };
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user);
    promise.then(connected);
    promise.catch(connectionError);
}

function connected() {
    setInterval(keepConnection, 5000);
    update()
    setInterval(update, 3000);
}


function connectionError(error) {
    if (error.response.status == 400)
    {
        alert("Nome em uso, tente outro nome");

        enterRoom();
    }
    else
    {
        alert("Sua conexão com o servidor foi perdida. A página irá atualizar automaticamente!");
        window.location.reload();
    }
}

function keepConnection() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", user);
    promise.catch(connectionError);
}

function getMessages() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(function (response) {
        mainContainer.innerHTML = '';
        let messages = response.data;
        for (let i = 0; i < messages.length; i++)
        {
            showMessage(messages[i]);
        }
        focusLastMessage();
    });
}

function focusLastMessage() {
    lastMessage = document.querySelector("main").lastChild;
    lastMessage.scrollIntoView();
}

function showMessage(message) {
    if (message.type === "status")
    {
        mainContainer.innerHTML += `
        <div class="${message.type}" data-test="message">
            <p><span class="time">${message.time}</span> <span class = "name">${message.from}</span> ${message.text}</p>
        </div>`;
    }
    else if (message.type === "message")
    {
        mainContainer.innerHTML += `
        <div class="${message.type}" data-test="message">
            <p><span class="time">${message.time}</span> <span class = "name">${message.from}</span> para <span class = "name">${message.to}</span>: ${message.text}</p>
        </div>`;
    }
    else if(message.to === user.name || message.from === user.name)
    {
        mainContainer.innerHTML += `
        <div class="${message.type}" data-test="message">
            <p><span class="time">${message.time}</span> <span class = "name">${message.from}</span> reservadamente para <span class = "name">${message.to}</span>: ${message.text}</p>
        </div>`;
    }
}

function sendMessage() {
    if (input.value === '') return;
    const message = {
        from: user.name,
        to: contactElementSelected.querySelector("p").innerHTML,
        text: input.value,
        type: visibilitySelected === "Público" ? "message" : "private_message"
    };

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", message);
    promise.then(getMessages);
    promise.catch(connectionError);

    input.value = '';
}

function sendWithEnter(event) {
    if (event.key == "Enter")
    {
        event.preventDefault();
        sendMessage();
    }
}
function getContacts() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then((response) => {
        contacts.innerHTML = `
        <div onclick="selectContact(this)" data-test="all">
            <ion-icon name="people"></ion-icon>
            <p>Todos</p>
            <ion-icon name="checkmark-sharp" class="checkmark" data-test="check"></ion-icon>
        </div>`;
        let contact = response.data;
        for (let i = 0; i < contact.length; i++)
        {
            showContact(contact[i]);
        }
        selectContact(contacts.querySelector(".selected"));
        if (contactElementSelected === null)
        {
            selectContact(contacts.querySelector("div"));
        }
    })
}

function showContact(contact) {
    if (contact.name === contactElementSelected.querySelector("p").innerHTML)
    {
        contacts.innerHTML += `
            <div class="selected" onclick="selectContact(this)" data-test="participant">
                <ion-icon name="person-circle-outline"></ion-icon>
                <p>${contact.name}</p>
                <ion-icon name="checkmark-sharp" class="checkmark" data-test="check"></ion-icon>
            </div>`;
    }
    else
    {
        contacts.innerHTML += `
            <div onclick="selectContact(this)" data-test="participant">
                <ion-icon name="person-circle-outline"></ion-icon>
                <p>${contact.name}</p>
                <ion-icon name="checkmark-sharp" class="checkmark" data-test="check"></ion-icon>
            </div>`;
    }
}

function toggleSideBar() {
    sideBar.classList.toggle("hidden");
}

function selectContact(element) {
    if (element === null)
    {
        contactElementSelected = null;
        return;
    }

    contactElementSelected !== null ? contactElementSelected.classList.remove("selected") : null;

    contactElementSelected = element;
    contactName = contactElementSelected.querySelector("p").innerHTML;

    contactElementSelected.classList.add("selected");

    setSendingTo();
}

function selectVisibility(element) {
    visibilityElementSelected.classList.remove("selected");

    visibilityElementSelected = element;
    visibilitySelected = visibilityElementSelected.querySelector("p").innerHTML;

    element.classList.add("selected");

    setSendingTo();
}

function setSendingTo() {
    sendingTo.innerHTML = `Enviando para ${contactName} (${visibilitySelected})`;
}

function update() {
    getMessages();
    getContacts();
}