async function loadSection() {
    try {
        let response = await fetch("status.txt");
        let section = await response.text();
        document.getElementById("content").innerHTML = getSectionContent(section.trim());
    } catch (error) {
        console.error("Fehler beim Laden des Abschnitts:", error);
    }
}

function getSectionContent(section) {
    const sections = {
        "1": "🏰 Historische Fakten über Berlin",
        "2": "🏛 Architektur & Design",
        "3": "🎭 Kulturelle Highlights"
    };
    return sections[section] || "🎉 Tour beendet!";
}

async function updateSection() {
    let response = await fetch("status.txt");
    let currentSection = await response.text();
    let nextSection = parseInt(currentSection.trim()) + 1;

    let requestOptions = {
        method: "POST",
        body: nextSection
    };

    fetch("status.txt", requestOptions)
        .then(response => response.text())
        .then(() => alert("Nächster Abschnitt freigeschaltet!"))
        .catch(error => console.error("Fehler:", error));
}

function likeSection() {
    alert("Danke für dein Like!");
}
