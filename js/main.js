const openModal = (idModal) => {
    const divModal = document.querySelector(idModal)
    divModal.style.display = "flex"
}

const closeModal = (idModal) => {
    const divModal = document.querySelector(idModal)
    divModal.style.display = "none"
}

const handleModalClose = (event) => {
    if(event.target.className === "modal"){
        event.target.style.display = "none"
    }
}

const handleAddAgentCard = async (event) => {
    event.preventDefault()
    const uuid = event.target.agentCard.value

    try{
        const response = await fetch(`https://valorant-api.com/v1/agents/${uuid}`) // faz a requisição na API
        const responseJson = await response.json() // transforma a resposta JSON em objeto
        const data = responseJson.data

        if(response.status == 200){
            const newAgentCard = 
            {id: data.uuid, displayName: data.displayName, 
                displayIcon: data.displayIcon, roleIcon: data.role.displayIcon, 
                skill1: data['abilities']['0']['displayIcon'], skill2: data['abilities']['1']['displayIcon'],
                skill3: data['abilities']['2']['displayIcon'], skill4: data['abilities']['3']['displayIcon'],
                description: data.description, background: data.background, fullPortrait: data.fullPortrait,
                s1Name: data['abilities']['0']['displayName'], s1Desc: data['abilities']['0']['description'],
                s2Name: data['abilities']['1']['displayName'], s2Desc: data['abilities']['1']['description'],
                s3Name: data['abilities']['2']['displayName'], s3Desc: data['abilities']['2']['description'],
                s4Name: data['abilities']['3']['displayName'], s4Desc: data['abilities']['3']['description']}
            agentCardsList.push(newAgentCard)
            renderAgentCards()
            return data;
        }else{
            alert(`Not Found!`)
        }
    } catch (error){
        alert(error)
    }
}

const listByRoleCard = async (uuid) => {   
    try{
        const response = await fetch(`https://valorant-api.com/v1/agents/${uuid}`) // faz a requisição na API
        const responseJson = await response.json() // transforma a resposta JSON em objeto
        const data = responseJson.data

        if(response.status == 200){
            const newAgentCard = 
            {id: data.uuid, displayName: data.displayName, 
                displayIcon: data.displayIcon, roleIcon: data.role.displayIcon, 
                skill1: data['abilities']['0']['displayIcon'], skill2: data['abilities']['1']['displayIcon'],
                skill3: data['abilities']['2']['displayIcon'], skill4: data['abilities']['3']['displayIcon'],
                description: data.description, background: data.background, fullPortrait: data.fullPortrait,
                s1Name: data['abilities']['0']['displayName'], s1Desc: data['abilities']['0']['description'],
                s2Name: data['abilities']['1']['displayName'], s2Desc: data['abilities']['1']['description'],
                s3Name: data['abilities']['2']['displayName'], s3Desc: data['abilities']['2']['description'],
                s4Name: data['abilities']['3']['displayName'], s4Desc: data['abilities']['3']['description']}
            agentCardsList.push(newAgentCard)
            renderAgentCards()
            return data;
        }else{
            alert(`Not Found!`)
        }
    } catch (error){
        alert(error)
    }
}

const listByRole = async (roleName) => {
    try{
        agentCardsList = []
        const response = await fetch(`https://valorant-api.com/v1/agents/`) // faz a requisição na API
        if(response.status == 200){
            const responseJson = await response.json() // transforma a resposta JSON em objeto.
            const data = responseJson.data.filter(personagem => personagem.role != null && personagem.role.displayName == roleName)
            data.forEach(personagem => listByRoleCard(personagem['uuid']))   
            renderAgentCards() 
        }else{
            alert(`Not Found!`)
        }
    } catch (error){
        alert(error)
    }
}



const refreshAgentCard = async (event) => {
    const divAgentCard = event.target.closest('.agentCard')
    const agentCardName = divAgentCard.querySelector('h2').textContent
    try{
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${agentCardName}&apikey=HAUCFV4MBFM2A2Z1`) // faz a requisição na API
        const data = await response.json() // transforma a resposta JSON em objeto
        const price = data["Global Quote"]["05. price"]
        const previousClosePrice = data["Global Quote"]["08. previous close"]
        if(price && previousClosePrice){
            const priceFormatted = parseFloat(price).toFixed(2)
            const previousClosePriceFormatted = parseFloat(previousClosePrice).toFixed(2)
            const newAgentCardList = agentCardsList.map((agentCard) => {
                if(agentCard.name === agentCardName){
                    return {name: agentCard.name, price: priceFormatted, closePrice: previousClosePriceFormatted}
                }else{
                    return agentCard
                }
            })
            agentCardsList = newAgentCardList
            renderAgentCards()
        }else{
            alert(`AgentCard ${agentCard} não encontrado para atualização!`)
        }
    } catch (error){
        alert(error)
    }
}

const handleAgentCardMouseEnter = (event) => {
    const agentCard = event.target
    const btnClose = agentCard.querySelector("#button-close")
    const btnEdit = agentCard.querySelector("#button-edit")
    const personagem = agentCardsList.find(personagem => personagem.displayName == agentCard.id)
    const cardDetail = document.querySelector('#card-details')
    cardDetail.innerHTML = `<div class="cardHoover">
    <div class="hoover-name">${personagem.displayName} <img class="hoover-icon--role" src='${personagem.roleIcon}'></div>
    <div class="hoover-sides"><img class="fullpt" src='${personagem.fullPortrait}'>

        <div class="abilitiesDescription">
            <div class="ability1">
                <div class="descriptionName"><img class="icon--abilities-hoover" src='${personagem.skill1}'> ${personagem.s1Name}</div>
                    <div class="description">${personagem.s1Desc}</div></div>

            <div class="ability2">
                <div class="descriptionName"><img class="icon--abilities-hoover" src='${personagem.skill2}'> ${personagem.s2Name}</div>
                    <div class="description">${personagem.s2Desc}</div></div>
            <div class="ability3">
                <div class="descriptionName"><img class="icon--abilities-hoover" src='${personagem.skill3}'> ${personagem.s3Name}</div>
                    <div class="description">${personagem.s3Desc}</div></div>

            <div class="ability4">
                <div class="descriptionName"><img class="icon--abilities-hoover" src='${personagem.skill4}'> ${personagem.s4Name}</div>
                    <div class="description">${personagem.s4Desc}</div></div>
        </div>
        </div>
</div>
`
    cardDetail.querySelector('.cardHoover').style.display = "block"
    btnClose.style.visibility = "visible"
    btnEdit.style.visibility = "visible"

}

const addAgentCardsEvents = () => {
    const agentCards = document.querySelectorAll(".agentCard")
    agentCards.forEach((agentCard) => {
        agentCard.addEventListener("mouseenter", handleAgentCardMouseEnter)
        agentCard.addEventListener("mouseleave", handleAgentCardMouseLeave)
    })
}

const handleAgentCardMouseLeave = (event) => {
    const agentCard = event.target
    const btnClose = agentCard.querySelector("#button-close")
    const btnEdit = agentCard.querySelector("#button-edit")
    document.querySelector('.cardHoover').style.display = "none"
    btnClose.style.visibility = "hidden"
    btnEdit.style.visibility = "hidden"
}

const removeAgentCard = (event) => {
    const btnClose = event.target
    const agentCard = btnClose.closest('.agentCard')
    const h2AgentCard = agentCard.querySelector('.card .card-name .card-name-name')
    const agentCardName = h2AgentCard.textContent
    newAgentCardList = agentCardsList.filter((agentCard) => {
        return agentCard.displayName !== agentCardName
    })
    agentCardsList = newAgentCardList
    renderAgentCards()
    document.querySelector('.cardHoover').style.display = "none"
}

const editModal = (event) => {
    openModal('#edit-name')
    //const btnEdit = event.target
    //const card = btnClose.closest('.agentCard')
    let card = document.querySelector(event);
    let agentFieldName = card.querySelector('.card .card-name .card-name-name');
    let agentNameCard = agentFieldName.textContent;
    let agentFieldImage = card.querySelector('.card .card-icon');
    let agentImage = agentFieldImage.src;


    let modal = document.querySelector('#edit-name');
    let agentFieldNameModal = modal.querySelector('.agent_name');
    agentFieldNameModal.innerHTML = agentNameCard;
    let agentFieldImageModal = modal.querySelector('.agent_icon');
    agentFieldImageModal.src = agentImage;
}

const saveEdit = () => {
    let modal = document.querySelector('#edit-name');

    let nameField = modal.querySelector('.agent_name');
    let id = nameField.innerHTML;
    let agentFieldNameModal = modal.querySelector('.agent_new_name');
    let agentName = agentFieldNameModal.value;

    let card = document.querySelector(`#${id}`)

    let agentFieldName = card.querySelector('.card .card-name .card-name-name');
    agentFieldName.innerHTML = agentName;

    closeModal('#edit-name');
}

const removeALL = () => {
    const agentCards = document.querySelectorAll(".agentCard")
    agentCards.forEach((agentCard) => {
        removeAgentCard()
    })
}

const modal = document.querySelector(".modal")
modal.addEventListener("click", handleModalClose)

addAgentCardsEvents()

const renderAgentCards = () => {
    const divAgentCardsList = document.querySelector("#agentCards-list")
    divAgentCardsList.innerHTML = ''
    agentCardsList.forEach((agentCard) => {

        const newAgentCard = 
        `<div class="agentCard" id="${agentCard.displayName}">
        <div class="wrapper-buttons">
            <button class="btn-edit" id="button-edit"  onclick="editModal('#${agentCard.displayName}')"><img class="btnEdit" src="/img/edit icon.png"></button>
            <button class="btn-close" id="button-close"onclick="removeAgentCard(event)">X</button>
            </div>
            <div class="card">
                <div class="card-name"><span class="card-name-name">${agentCard.displayName}</span> <img class="card-icon--role" src='${agentCard.roleIcon}'></div>
                <img class="card-icon" src='${agentCard.displayIcon}'>
                <div class="abilities"><img class="icon--abilities" src='${agentCard.skill1}'><img class="icon--abilities" src='${agentCard.skill2}'> <img class="icon--abilities" src='${agentCard.skill3}'> <img class="icon--abilities" src='${agentCard.skill4}'></div>
            </div>
        </div>
            `
        divAgentCardsList.innerHTML += newAgentCard
    })
    addAgentCardsEvents()
}

let agentCardsList = [{displayName: 'Fade', displayIcon: 'https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/displayicon.png', 
roleIcon: 'https://media.valorant-api.com/agents/roles/1b47567f-8f7b-444b-aae3-b0c634622d10/displayicon.png', 
skill1: 'https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/abilities/ability1/displayicon.png', 
skill2: 'https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/abilities/ability2/displayicon.png',
skill3: 'https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/abilities/grenade/displayicon.png',
skill4: 'https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/abilities/ultimate/displayicon.png',
fullPortrait: 'https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/fullportrait.png',
s1Name: 'Seize', s1Desc:'EQUIP a knot of raw fear. FIRE to throw. The knot drops down after a set time. RE-USE to drop the knot early. The knot ruptures on impact, holding nearby enemies in place. Held enemies are Deafened, and Decayed.',
s2Name: 'Haunt', s2Desc: 'EQUIP a haunting watcher. FIRE to throw. The watcher drops down after a set time. RE-USE to drop the watcher early. The watcher lashes out on impact, Revealing enemies in its line of sight and creating terror trails to them. Enemies can destroy the watcher.',
s3Name: 'Prowler', s3Desc:'EQUIP a prowler. FIRE to send the prowler forward. HOLD FIRE to steer the prowler towards your crosshair. The prowler will chase down the first enemy or terror trail it sees, and Nearsight the enemy on impact.',
s4Name: 'Nightfall', s4Desc:'EQUIP the power of nightmare itself. FIRE to unleash a wave of unstoppable nightmare energy. Enemies caught in the wave are Marked by terror trails, Deafened, and Decayed.'}]
renderAgentCards()
