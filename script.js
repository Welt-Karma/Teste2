function saveLetter() {
    const title = document.getElementById("letterTitle").value.trim();
    const author = document.getElementById("authorName").value.trim();
    const letterText = document.getElementById("loveLetter").value.trim();

    if (title === "" || author === "" || letterText === "") {
        alert("Preencha todos os campos antes de salvar, por favor!");
        return;
    }

    const currentDate = new Date().toLocaleString("pt-BR");
    let letters = JSON.parse(localStorage.getItem("letters")) || [];
    letters.push({ title, author, text: letterText, date: currentDate });
    localStorage.setItem("letters", JSON.stringify(letters));

    // Enviar a carta para o servidor para salvar como arquivo de texto
    fetch("http://localhost:3000/salvar-carta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, text: letterText }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
    })
    .catch(error => console.error("Erro ao salvar a carta no servidor:", error));

    document.getElementById("letterTitle").value = "";
    document.getElementById("authorName").value = "";
    document.getElementById("loveLetter").value = "";
    displayLetters();
}

function displayLetters() {
    const lettersList = document.getElementById("lettersList");
    lettersList.innerHTML = "";
    let letters = JSON.parse(localStorage.getItem("letters")) || [];

    letters.forEach((letter, index) => {
        let li = document.createElement("li");

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = index;

        let letterInfo = document.createElement("span");
        letterInfo.innerHTML = `<strong>${letter.title}</strong> por <em>${letter.author}</em><br>Escrita em: ${letter.date}`;

        let openButton = document.createElement("button");
        openButton.className = "open-button";
        openButton.textContent = "Abrir Carta";
        openButton.onclick = () => openLetter(letter);

        li.appendChild(checkbox);
        li.appendChild(letterInfo);
        li.appendChild(openButton);
        lettersList.appendChild(li);
    });
}

function openLetter(letter) {
    document.getElementById("modalTitle").textContent = letter.title;
    document.getElementById("modalText").textContent = letter.text;
    document.getElementById("modal").style.display = "flex";

    // Ativar o botão de instalar carta
    document.getElementById("installButton").onclick = () => installLetter(letter);
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function installLetter(letter) {
    const blob = new Blob([letter.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${letter.title}.txt`;
    link.click();
    URL.revokeObjectURL(url);
}

function deleteSelectedLetters() {
    let letters = JSON.parse(localStorage.getItem("letters")) || [];
    const checkboxes = document.querySelectorAll("#lettersList input:checked");

    if (checkboxes.length === 0) {
        alert("Selecione pelo menos uma carta para apagar.");
        return;
    }

    checkboxes.forEach(checkbox => {
        const index = parseInt(checkbox.value);
        letters[index] = null; // Marca para remoção
    });

    letters = letters.filter(letter => letter !== null);
    localStorage.setItem("letters", JSON.stringify(letters));

    displayLetters();
}

document.addEventListener("DOMContentLoaded", displayLetters);
