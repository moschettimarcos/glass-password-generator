const passwordEl = document.getElementById("password");
const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const bar = document.getElementById("bar");
const copyBtn = document.getElementById("copy");
const generateBtn = document.getElementById("generate");
const checkboxes = [...document.querySelectorAll("[data-charset]")];

const chars = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()-_=+[]{};:,.?",
};


function randomIndex(max) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
}

function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
        const j = randomIndex(i + 1);
        [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
}

function generatePassword() {
    const length = Number(lengthInput.value);
    const sets = checkboxes
        .filter((box) => box.checked)
        .map((box) => chars[box.dataset.charset]);

        lengthValue.textContent = length;
        copyBtn.disabled = sets.length === 0;

        if (sets.length === 0) {
            passwordEl.textContent = "Select an option";
            updateStrength(0);
            return;
        }

        const pool = sets.join("");
        const password = sets.map((set) =>set[randomIndex(set.length)]);

        while (password.length < length) {
            password.push(pool[randomIndex(pool.length)]);
        }
        
        passwordEl.textContent = shuffle(password).join("");
        updateStrength(length * Math.log2(pool.length));
}

function updateStrength(bits) {
    let width = "25%";
    let color = "#ef4444";

    if (bits === 0) width = "0%";
    else if (bits >= 80) [width, color] = ["100%", "#22c55e"];
    else if (bits >= 60) [width, color] = ["75%", "#a3e635"];
    else if (bits >= 40) [width, color] = ["50%", "#facc15"];

    bar.style.width = width;
    bar.style.background = color;
}

lengthInput.addEventListener("input", generatePassword);
checkboxes.forEach((box) => box.addEventListener("change", generatePassword));
generateBtn.addEventListener("click", generatePassword);

copyBtn.addEventListener("click", async () => {
    await navigator.clipboard.writeText(passwordEl.textContent);
    copyBtn.classList.add("copied");
    setTimeout(() => copyBtn.classList.remove("copied"), 1200);
});

generatePassword();



