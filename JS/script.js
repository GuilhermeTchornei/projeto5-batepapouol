const user = { name: prompt("Qual seu lindo nome?") };
let messages = [];
const mainContainer = document.querySelector("main");

enterRoom();
function enterRoom() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user);
    promise.then(connected);
    promise.catch(connectionError);
}

function connected(response) {
    const connectionMessage = {
        from: user.name,
        to: "Todos",
        text: "entra na sala...",
        type: "status"
    };
    console.log(connectionMessage);
    //let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", connectionMessage);
    //promise.then(conectado);
    //propromisemisse.catch(erro);

    setInterval(keepConnection, 5000);
    setInterval(getMessages, 3000);
}

function conectado(response) {
    alert("Conectado" + response.status);
}
function erro(response) {
    alert(erro.response.status);
}

function connectionError(error) {
    if (error.response.status == 400)
    {
        alert("Nome inváido, tente novamente");
    }
}

function keepConnection() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", user);
    promise.catch(endConnection);
}

function getMessages() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(function (response) {
        const newMessages = response.data;
        for (let i = messages.length; i < newMessages.length; i++)
        {
            messages.push(newMessages[i]);
            showMessage(messages[i]);
        }
    });

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
    else
    {
        mainContainer.innerHTML += `
        <div class="${message.type}">
            <p><span class="time">${message.time}</span> <span class = "name">${message.from}</span> reservadamente para <span class = "name">${message.to}</span>: ${message.text}</p>
        </div>`;
    }


}

function endConnection(error) {

}