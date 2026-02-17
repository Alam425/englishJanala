const headerSection = document.getElementById("header")
const logOutBtn = document.querySelectorAll(".logOutBtn")
const modalPopUp = document.getElementById("modal")
const spinnerSec = document.getElementById("spinner")
const nameInput = document.getElementById("nameInput")
const passwordInput = document.getElementById("passwordInput")
const inputAction = document.getElementById("inputAction")
const bannerSection = document.getElementById("banner")
const lessonSection = document.getElementById("lessons")
const learnSection = document.getElementById("learn")
const faqSection = document.getElementById("faq")
const noLessonSelectedSection = document.getElementById("noLessonSelected")
const noLessonAvailableSection = document.getElementById("noLessonAvailable")
const vocabularySection = document.getElementById("vocabularies")


faqSection.classList.add("hidden")
learnSection.classList.add("hidden")
headerSection.classList.add("hidden")


// -------------------------------------word utterance-------------------------------------
function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-EN';
    window.speechSynthesis.speak(utterance);
}
// ----------------------------------------------------------------------------------------


// ---------------------------------------spinner---------------------------------------
const loader = document.createElement("div")
loader.innerHTML = "<span class='loading mx-auto loading-spinner loading-xl'></span>"
// -------------------------------------------------------------------------------------



// ------------------------------------smooth scroll------------------------------------
const scrollToSection = (event, id) => {
    event.preventDefault()
    document.getElementById(id).scrollIntoView({ behavior: "smooth" })
}
// ------------------------------------------------------------------------------------



// --------------------------------------active class function--------------------------------------
const aciveClass = id => {
    noLessonSelectedSection.classList.add('hidden')
    const allActiveClasses = document.querySelectorAll(".active")
    allActiveClasses.forEach(activeClas => {
        activeClas.classList.remove("active")
    })
    document.getElementById(id).classList.add("active")
    vocabularySection.innerHTML = ""
    loadVocabularies(id)
}
// ------------------------------------------------------------------------------------------------


// -----------------------------------display all levels section-----------------------------------

const loadAllLevels = async () => {
    lessonSection.appendChild(loader)
    await fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then(data => {
            displayLevels(data?.data)
            lessonSection.removeChild(loader)
        })
}

const displayLevels = (data) => {
    data?.forEach(level => {
        const levelBtn = document.createElement('btn')
        levelBtn.innerHTML = `
        <button onclick="aciveClass('${level?.level_no}')" id="${level?.level_no}" class="ml-2 btn btn-outline btn-primary">
            <img src="assets/fa-book-open.png" alt="">
            <p class="text-lg">Lesson${level?.level_no}</p>
        </button>`
        lessonSection.appendChild(levelBtn)
    });
}
// ------------------------------------------------------------------------------------------------



// -------------------------------------load vocabularies section-------------------------------------
const loadVocabularies = async (id) => {
    spinnerSec.appendChild(loader)
    await fetch(`https://openapi.programming-hero.com/api/level/${id}`)
        .then(res => res.json())
        .then(data => {
            displayVocabulariesCard(data?.data)
            spinnerSec.removeChild(loader)
        })
}

const displayVocabulariesCard = data => {
    if (Object.keys(data).length < 1) {
        noLessonAvailableSection.removeAttribute("hidden")
        vocabularySection.classList.remove("p-10")
        return;
    }
    vocabularySection.innerHTML = ''
    data?.forEach(vocabulary => {
        const word = vocabulary?.word
        const vocabularyCard = document.createElement("div")
        vocabularyCard.innerHTML = `
<div class="card bg-base-100 h-48 w-96 shadow-sm">
    <div class="card-body">
        <h2 class="text-2xl font-bold">${vocabulary?.word}</h2>
        <p class="text-lg">Meaning / Pronunciation</p>
        <h2 class="text-xl font-bold">${vocabulary?.meaning} / ${vocabulary?.pronunciation}</h2>
        <div class='flex justify-between items-center'>
        <button onclick="loadWordDetails('${vocabulary?.id}')"><img src="assets/information.png" class="w-6 h-6"></button>
        <button id="pronounceWord" data-word="${word}"><img src="assets/volume_4757903.png" class="w-6 h-6"></button>
        </div>
    </div>
</div>`
        vocabularyCard.querySelector("#pronounceWord").addEventListener("click", function() {
            pronounceWord(this?.dataset?.word)
        })
        vocabularySection.classList.add("p-10")
        vocabularySection.appendChild(vocabularyCard)
    })
}
// ---------------------------------------------------------------------------------------------------



// ----------------------------------------load word deatails----------------------------------------
const loadWordDetails = async id => {
    await fetch(`https://openapi.programming-hero.com/api/word/${id}`)
        .then(res => res.json())
        .then(data => {
            displayWordDeatails(data?.data)
        })
}

const displayWordDeatails = data => {
    const synonymsHtml = data?.synonyms?.reduce((acc, da) => {
        return acc + `<button class="text-slate-700 text-xl py-1 pr-1 mr-2 border-b-2 border-slate-700">${da}</button>`
    }, '')

    modalPopUp.innerHTML = ""
    const modalBox = document.createElement('div')
    modalBox.innerHTML = `
    <dialog id="modal" class="modal sm:modal-middle">
    <div class="modal-box text-left rounded-md font-bold">
        <div class="m-2 p-2 border-2 rounded-md border-gray-100">
            <h3 class="text-2xl font-bold">${data?.word || "No Word Availble"}</h3>
        <h3 class="flex text-md text-slate-700 h-8 my-auto items-center" data-word='${data?.word}' id="mic"><img class="w-7 h-7" src="assets/mic.png">: ${data?.pronunciation || "No Pronunciation Available"}</h3>
        <p class="pt-2 font-semibold">Meaning</p>
        <p class="pb-2 text-slate-700">${data?.meaning || "No Meaning Available"}</p>
        <p class="pt-2 font-semibold">Example</p>
        <p class="pb-2 text-slate-700">${data?.sentence || "No Sentence Available"}</p>
        <p class="pt-2 text-base font-semibold">সমার্থক শব্দ গুলো</p>
        <button class="mb-7">${synonymsHtml || "No Synonym Available"}</button>
        </div>
            <form class="ml-2" method="dialog">
                <button id="closeModal" class="btn btn-primary">Complete Learning</button>
            </form>
    </div>
    </dialog>
    `
    modalBox.querySelector("#mic").addEventListener('click', function(){
        pronounceWord(this.dataset.word)
    })
    modalPopUp.appendChild(modalBox)
    modalBox.querySelector("#modal").showModal()
}
// --------------------------------------------------------------------------------------------------



// ------------------------------get started button & log out button toggle------------------------------
inputAction.addEventListener("click", function inputActionFunc() {
    const passwordInputValue = passwordInput.value
    const nameInputValue = nameInput.value

    if (!nameInputValue) {
        alert("Please, Input Your Name")
        return;
    }
    else if (passwordInputValue !== "123456") {
        alert("Please Provide Correct Password")
        return;
    }
    
    passwordInput.value = ""
    nameInput.value = ""
    alert("Login Successful")
    faqSection.classList.remove("hidden")
    learnSection.classList.remove("hidden")
    headerSection.classList.remove("hidden")
    bannerSection.classList.add("hidden") 
})

logOutBtn.forEach(singleLogOutBtn => {
    singleLogOutBtn.addEventListener("click", function logOutBtnFunc() {
        headerSection.classList.add("hidden")
        faqSection.classList.add("hidden")
        learnSection.classList.add("hidden") 
        bannerSection.classList.remove("hidden")
    })
})

loadAllLevels()