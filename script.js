const logOutBtn = document.getElementById("logOutBtn")
const nameInput = document.getElementById("nameInput")
const passwordInput = document.getElementById("passwordInput")
const inputAction = document.getElementById("inputAction")
const lessonSection = document.getElementById("lessons")
const learnSection = document.getElementById("learn")
const noLessonSelectedSection = document.getElementById("noLessonSelected")
const noLessonAvailableSection = document.getElementById("noLessonAvailable")
const vocabularySection = document.getElementById("vocabularies")

logOutBtn.setAttribute("disabled", true)


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
    await fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then(data => displayLevels(data?.data))
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
    await fetch(`https://openapi.programming-hero.com/api/level/${id}`)
        .then(res => res.json())
        .then(data => displayVocabulariesCard(data?.data))
}

const displayVocabulariesCard = data => {
    if (Object.keys(data).length < 1) {
        noLessonAvailableSection.removeAttribute("hidden")
        vocabularySection.classList.remove("p-10")
        return;
    }
    console.log()
    data?.forEach(vocabulary => {
        const vocabularyCard = document.createElement("div")
        vocabularyCard.innerHTML = `
<div class="card bg-base-100 h-48 w-96 shadow-sm">
    <div class="card-body">
        <h2 class="text-2xl font-bold">${vocabulary?.word}</h2>
        <p class="text-lg">Meaning / Pronunciation</p>
        <h2 class="text-xl font-bold">${vocabulary?.meaning} / ${vocabulary?.pronunciation}</h2>
        <div class='flex justify-between items-center'>
        <button><img src="assets/fa-circle-question.png" class="w-6 h-6"></button>
        <button><img src="assets/volume_4757903.png" class="w-6 h-6"></button>
        </div>
    </div>
</div>`
        vocabularySection.classList.add("p-10")
        vocabularySection.appendChild(vocabularyCard)
    })
}
// ---------------------------------------------------------------------------------------------------



// ----------------------------------------load word deatails----------------------------------------
const loadWordDeatails = async id => {
    await fetch(`https://openapi.programming-hero.com/api/word/${id}`)
        .then(res => res.json())
        .then(data => displayWordDeatails(data))
}

const displayWordDeatails = data => {
    console.log(data)
}
// --------------------------------------------------------------------------------------------------



// ------------------------------get started button & log out button toggle------------------------------
inputAction.addEventListener("click", function inputActionFunc(key) {
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
    inputAction.setAttribute('disabled', true)
    logOutBtn.removeAttribute("disabled")
    passwordInput.value = ""
    nameInput.value = ""
})

logOutBtn.addEventListener("click", function logOutBtnFunc() {
    logOutBtn.setAttribute("disabled", true)
    inputAction.removeAttribute("disabled")
})
// ------------------------------------------------------------------------------------------------------

loadAllLevels()