const lessonSection = document.getElementById("lessons")
const vocabularySection = document.getElementById("vocabularies")

const aciveClass = id => {
    const allActiveClasses= document.querySelectorAll(".active")
    allActiveClasses.forEach(activeClas => {
        activeClas.classList.remove("active")
    })
    document.getElementById(id).classList.add("active")
    loadVocabularies(id)
}

const loadAllLevels = async() => {
    await fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then(data => displayLevels(data?.data))
    }

const displayLevels = (data) => {
    data?.forEach(level => {
        const levelBtn = document.createElement('btn')
        levelBtn.innerHTML = `
        <button onclick="aciveClass('${level?.level_no}')" id="${level?.level_no}" class="btn btn-outline btn-primary">
            <img src="assets/fa-book-open.png" alt="">
            <p class="text-lg">Lesson${level?.level_no}</p>
        </button>`
        lessonSection.appendChild(levelBtn)
    });
}


const loadVocabularies = async(id) => {
    await fetch(`https://openapi.programming-hero.com/api/level/${id}`)
    .then(res => res.json())
    .then(data => displayVocabulariesCard(data?.data))
}

const displayVocabulariesCard = data => {
    data?.forEach(vocabulary => {
        const vocabularyCard = document.createElement("div")
        vocabularyCard.innerHTML = `
<div class="card bg-base-100 h-48 w-96 shadow-sm">
    <div class="card-body">
        <h2 class="text-2xl font-bold">${vocabulary?.word}</h2>
        <p class="text-lg">Meaning / Pronunciation</p>
        <h2 class="text-xl font-bold">${vocabulary?.meaning} / ${vocabulary?.pronunciation}</h2>
    </div>
</div>`
    vocabularySection.appendChild(vocabularyCard)
    })
}

loadAllLevels()