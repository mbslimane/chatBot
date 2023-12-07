// const sendChatBt = document.querySelector("#send-btn")
const chatInput = document.querySelector(".chat-input textarea")
const sendChatBtn = document.querySelector(".chat-input span")
// const outgoing = document.querySelector(".outgoing")
const chatBox = document.querySelector(".chatbox")
const chatbotToggler = document.querySelector(".chatbot-toggler")
const chatbotCloseBtn = document.querySelector(".close-btn")

let userMessage
const API_KEY = "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"
const inputInitHeight = chatInput.scrollHeight

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li")
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span> <p></p>`
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi
}

const generateRespense = (incomingChatLi) =>{
    const API_URL =  'https://api.openai.com/v1/chat/completions'
    const messageElement = incomingChatLi.querySelector("p")

    // Defin the proprties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage }]
        })
    }

    // send POST request to API, get respanse
    fetch(API_URL , requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content
        console.log(data.choices[0].message.content);
        // chatBox.lastChild.remove()
        // chatBox.appendChild(createChatLi((data.choices[0].message.content), "incoming"))
    }).catch((err) =>{
        messageElement.classList.add("error")
        messageElement.textContent ="oops Sth went wrong. Please check YOUR internet connection" 
    }).finally(() => chatBox.scrollTo(0, chatBox.scrollHeight))
}

const handlechat = () =>{
    userMessage = chatInput.value.trim()
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`
    // Append the user's message to the chatbox
    chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    chatBox.scrollTo(0, chatBox.scrollHeight)

    setTimeout(() => {
        // Display "Thinkig..." message while waiting for the respanse
        const incomingChatLi = createChatLi("Thinking...", "incoming")
        chatBox.appendChild(incomingChatLi)
        chatBox.scrollTo(0, chatBox.scrollHeight)
        generateRespense(incomingChatLi)
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`
    chatInput.style.height = `${chatInput.scrollHeight}px`
})
chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the windw 
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handlechat()
    }
})

sendChatBtn.addEventListener("click", handlechat)
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"))
chatbotToggler.addEventListener("click", ()=> document.body.classList.toggle("show-chatbot"))