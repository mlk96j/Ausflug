const sections = [
    {
        title: "Historisches Berlin",
        content: [
            "Geschichte des Brandenburger Tors",
            "Bedeutung für die Deutsche Einheit",
            "Architektonische Merkmale",
            "Interessante Anekdoten"
        ]
    },
    {
        title: "Architektur & Moderne",
        content: [
            "Wiederaufbau nach dem Krieg",
            "Moderne Hochhäuser & Design",
            "Bedeutung für die Berliner Wirtschaft",
            "Kulturelle Veranstaltungen"
        ]
    },
    {
        title: "Berliner Kultur",
        content: [
            "Überblick über die Museumsinsel",
            "Bedeutung der Kunstwerke",
            "Verborgene Geschichten hinter den Museen",
            "Zukunftspläne für die Museumsinsel"
        ]
    }
];

async function loadSection() {
    let response = await fetch("status.txt");
    let text = await response.text();
    let lines = text.split("\n");

    let currentSection = parseInt(lines[0]);

    // 🔴 Falls die Tour beendet ist (Status = 4), zur final.html weiterleiten
    if (currentSection >= 4) {
        window.location.href = "final.html";
        return;
    }

    let likes = lines.slice(1).map(line => line.split(" ").map(Number));
    let section = sections[currentSection - 1];

    if (!section) {
        document.getElementById("content").innerHTML = "<p>Tour beendet!</p>";
        return;
    }

    let html = `<h2>${section.title}</h2>`;
    section.content.forEach((para, index) => {
        html += `
            <div class="paragraph-box">
                <p>${para}</p>
                <button onclick="likeParagraph(${currentSection}, ${index})">👍 ${likes[currentSection - 1][index]}</button>
            </div>
        `;
    });

    document.getElementById("content").innerHTML = html;
}

async function likeParagraph(sectionId, paragraphIndex) {
    let response = await fetch("status.txt");
    let text = await response.text();
    let lines = text.split("\n");

    let likes = lines.slice(1).map(line => line.split(" ").map(Number));
    likes[sectionId - 1][paragraphIndex]++;

    let newContent = lines[0] + "\n" + likes.map(line => line.join(" ")).join("\n");
    
    await fetch("status.txt", { 
        method: "POST",
        body: newContent
    });

    loadSection();
}

async function updateSection() {
    let response = await fetch("status.txt");
    let text = await response.text();
    let lines = text.split("\n");

    let currentSection = parseInt(lines[0]) + 1;

    if (currentSection > sections.length) {
        alert("Alle Abschnitte wurden bereits freigeschaltet!");
        return;
    }

    let newContent = currentSection + "\n" + lines.slice(1).join("\n");

    await fetch("status.txt", { 
        method: "POST",
        body: newContent
    });

    alert("Nächster Abschnitt freigeschaltet!");
}

async function loadFinalPage() {
    let response = await fetch("status.txt");
    let text = await response.text();
    let lines = text.split("\n");
    let likes = lines.slice(1).map(line => line.split(" ").map(Number));

    let html = "<h2>Die beliebtesten Abschnitte</h2>";
    sections.forEach((section, sectionIndex) => {
        let likedParagraphs = section.content.filter((_, paraIndex) => likes[sectionIndex][paraIndex] > 0);
        if (likedParagraphs.length > 0) {
            html += `<h3>${section.title}</h3>`;
            likedParagraphs.forEach(para => {
                html += `<div class="paragraph-box"><p>${para}</p></div>`;
            });
        }
    });

    document.getElementById("finalContent").innerHTML = html;
}
