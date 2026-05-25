import { OpenGroup } from "./Messages.js"

const groupsBar = document.getElementById("GroupsBar")

async function AddGroups(){
    const groups = await GetGroups()
    for(let i = 0; i < groups.length + 1; i++){
        const groupContent = document.createElement("div")
        groupsBar.appendChild(groupContent)
        groupContent.className = "groupContent"


        const groupDiv = document.createElement("div")
        groupContent.appendChild(groupDiv)
        groupDiv.className = "groupDiv"

        const groupImg = document.createElement("img")
        groupDiv.appendChild(groupImg)
        groupImg.className = "groupImage"
        if(i === groups.length){
            // the plus where you can make new group
            groupImg.src = "https://static.vecteezy.com/system/resources/thumbnails/015/286/969/small/plus-sign-icon-free-png.png"
            groupDiv.className += " groupPlusDiv"
            groupDiv.addEventListener("click", AddNewGroupButton)
            groupDiv.style.marginBottom = "10px"
        }
        else{
            groupImg.src = groups[i].image

            groupImg.onerror = () => {
                //no image, use first 3 of name
                groupImg.remove()
                const groupText = document.createElement("p")
                groupText.innerText = groups[i].name.slice(0, 5);
                groupDiv.appendChild(groupText)
            }
            const groupHoverText = document.createElement("div")
            groupHoverText.innerText = groups[i].name
            groupContent.appendChild(groupHoverText)
            groupHoverText.className = "groupHoverText"

            groupDiv.addEventListener("click", () => OpenGroup(groups[i]._id))
        }
        
    }
}

async function GetGroups(){
    const response = await fetch('/groups', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    if(response.status === 404){
        return []
    }
    else{
        const data = await response.json()
        return data.data
    }
}


function AddNewGroupButton(){
    
    const makeGroupPopUp = document.createElement("div")
    makeGroupPopUp.className = "popUp"
    document.body.appendChild(makeGroupPopUp)
    makeGroupPopUp.style.display = "block"

    const makeGroupContent = document.createElement("div")
    makeGroupContent.className = "popUp-content"
    makeGroupPopUp.appendChild(makeGroupContent)

    const groupX = document.createElement("span")
    groupX.className = "x"
    groupX.innerHTML = "&times;"
    makeGroupContent.appendChild(groupX)
    groupX.addEventListener("click", () => {
        makeGroupPopUp.remove()
    })

    const groupTitleText = document.createElement("p")
    groupTitleText.innerText = "Make A New Group"
    groupTitleText.style.fontSize = "28px"
    makeGroupContent.appendChild(groupTitleText)

    const groupNameText = document.createElement("p")
    groupNameText.innerText = "Group Name"
    groupNameText.style.fontSize = "20px"
    groupNameText.style.marginTop = "0px"
    groupNameText.style.marginBottom = "0px"
    makeGroupContent.appendChild(groupNameText)

    const groupNameInput = document.createElement("input")
    makeGroupContent.appendChild(groupNameInput)
    groupNameInput.placeholder = "Group Name..."
    groupNameInput.required = true

    const groupImageText = document.createElement("p")
    groupImageText.innerText = "Image Link"
    groupImageText.style.fontSize = "20px"
    groupImageText.style.marginTop = "0px"
    groupImageText.style.marginBottom = "0px"
    makeGroupContent.appendChild(groupImageText)

    const groupImageInput = document.createElement("input")
    makeGroupContent.appendChild(groupImageInput)
    groupImageInput.placeholder = "Image Link..."

    const groupButton = document.createElement("button")
    makeGroupContent.appendChild(groupButton)
    groupButton.innerText = "Make Group"
    groupButton.addEventListener("click", () => MakeGroup(groupNameInput.value, groupImageInput.value, makeGroupPopUp))
}

async function MakeGroup(name, image, groupPopUp){
    if(name.replaceAll(" ", "") !== ""){
        groupPopUp.remove()
        const response = await fetch('/newgroup', {
            method: "POST",
            body: JSON.stringify({ 
                name: name,
                image: image
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json()
        window.location.reload();
    }
    else{
        alert("type something in name")
    }
    
}

AddGroups()