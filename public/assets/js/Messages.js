const socket = io();

const ChatDiv = document.getElementById("ChatDiv")
const ChatInput = document.getElementById("ChatInput")
const ChatMessagesDiv = document.getElementById("ChatMessagesDiv")

const AddUserButton = document.getElementById("AddUserButton")
const LeaveGroupButton = document.getElementById("LeaveGroupButton")

const GroupTitleText = document.getElementById("GroupTitleText")

let groupId;

export async function OpenGroup(_id){
    groupId = _id
    socket.emit("joinGroup", groupId)
    
    const response = await fetch(`/group/${groupId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const json = await response.json()
    const data = json.data
    if(response.status === 404){
        alert(data)
    }
    else{
        ChatDiv.style.display = "flex"
        GroupTitleText.innerText = data.name
        AddAllMessages(data)
    }
}

function AddAllMessages(data){
    ChatMessagesDiv.innerHTML = ""

    if(data.messages){
        data.messages.map((message) => AddMessage(message))
    }
}
function AddMessage(message){
    const MessageDiv = document.createElement("div")
    ChatMessagesDiv.prepend(MessageDiv)
    MessageDiv.className = "ChatMessage"

    const MessageUserDiv = document.createElement("div")
    MessageDiv.appendChild(MessageUserDiv)
    MessageUserDiv.className = "MessageUserDiv"

    const MessageUserText = document.createElement("p")
    MessageUserDiv.appendChild(MessageUserText)
    MessageUserText.innerText = message.username
    MessageUserText.style.fontWeight = "1000"

    const MessageDateText = document.createElement("p")
    MessageUserDiv.appendChild(MessageDateText)
    MessageDateText.innerText = message.date
    MessageDateText.className = "DateText"
    


    if(message.message.startsWith("http") || message.message.startsWith("data:")){
        const MessageImg = document.createElement("img")
        MessageImg.src = message.message
        MessageDiv.appendChild(MessageImg)
        MessageImg.onerror = ()  => {
            MessageImg.remove() 
            const MessageP = document.createElement("p")
            MessageDiv.appendChild(MessageP)
            MessageP.innerText = message.message 
        }
    }
    else{
        const MessageP = document.createElement("p")
        MessageDiv.appendChild(MessageP)
        MessageP.innerText = message.message 
    }

    


    ChatMessagesDiv.scrollTop = 0
}

ChatInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter" && ChatInput.value.replaceAll(" ", "") !== "") {
        const message = ChatInput.value
        ChatInput.value = ""

        socket.emit("client-sends-message", { message: message, _id: groupId });


    }
})

AddUserButton.addEventListener("click", AddUserPopUp)

function AddUserPopUp(){
    const addUserPopUp = document.createElement("div")
    addUserPopUp.className = "popUp"
    document.body.appendChild(addUserPopUp)
    addUserPopUp.style.display = "block"

    const addUserContent = document.createElement("div")
    addUserContent.className = "popUp-content"
    addUserPopUp.appendChild(addUserContent)

    const userX = document.createElement("span")
    userX.className = "x"
    userX.innerHTML = "&times;"
    addUserContent.appendChild(userX)
    userX.addEventListener("click", () => {
        addUserPopUp.remove()
    })

    const userTitleText = document.createElement("p")
    userTitleText.innerText = "Add User"
    userTitleText.style.fontSize = "28px"
    addUserContent.appendChild(userTitleText)

    const userNameInput = document.createElement("input")
    addUserContent.appendChild(userNameInput)
    userNameInput.placeholder = "Username..."
    userNameInput.required = true

    const userButton = document.createElement("button")
    addUserContent.appendChild(userButton)
    userButton.innerText = "Add User"
    userButton.addEventListener("click", () => AddUser(userNameInput.value, addUserPopUp))
}
async function AddUser(name, addUserPopUp){
    if(name.replaceAll(" ", "") !== ""){
        
        const response = await fetch('/user', {
            method: "PUT",
            body: JSON.stringify({ 
                _id: groupId,
                name: name
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json()

        if(response.status === 404){
            alert(data.data)
        }
        else{
            addUserPopUp.remove()
            alert("user added")
        }
    }
    else{
        alert("type something")
    }
}

LeaveGroupButton.addEventListener("click", RemoveUserFromGroup)

async function RemoveUserFromGroup(){
    const response = await fetch('/removeUser', {
        method: "PUT",
        body: JSON.stringify({ 
            _id: groupId
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await response.json()
    if(response.status === 404)
        alert(data.data)
    else
        window.location.reload();
}

//someone sends message, then update messages
socket.on("server-sends-message", (data) => {
    AddMessage(data)
});