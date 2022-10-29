let user;
const mainContainer = document.querySelector("main");
const input = document.querySelector("textarea");

enterRoom();
function enterRoom() {
    user = { name: prompt("Qual seu lindo nome?") };
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user);
    promise.then(connected);
    promise.catch(connectionError);
}

function connected() {
    setInterval(keepConnection, 5000);
    getMessages();
    setInterval(getMessages, 3000);
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
        <div class="${message.type}">
            <p><span class="time">${message.time}</span> <span class = "name">${message.from}</span> ${message.text}</p>
        </div>`;
    }
    else if (message.type === "message")
    {
        mainContainer.innerHTML += `
        <div class="${message.type}">
            <p><span class="time">${message.time}</span> <span class = "name">${message.from}</span> para <span class = "name">${message.to}</span>: ${message.text}</p>
        </div>`;
    }
    else if(message.to === user.name)
    {
        mainContainer.innerHTML += `
        <div class="${message.type}">
            <p><span class="time">${message.time}</span> <span class = "name">${message.from}</span> reservadamente para <span class = "name">${message.to}</span>: ${message.text}</p>
        </div>`;
    }
}

function sendMessage() {
    if (input.value === '') return;
    const message = {
        from: user.name,
        to: "Todos",
        text: input.value,
        type: "message"
    };

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", message);
    promise.then(getMessages);
    promise.catch(connectionError);

    input.value = '';
}