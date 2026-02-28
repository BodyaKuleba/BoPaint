let canv = document.getElementById("canvas");
let ctx = canv.getContext("2d");

const colorMenu = document.querySelector(".colorMenu")
const menuClickFalse = document.querySelector(".menuClickFalse")
const menuClickTrue = document.querySelector(".menuClickTrue")

const colorBtns = document.querySelectorAll(".colorSelectBtn")

const customColor = document.querySelector("#customColorSelect")
const customColorCanv = document.querySelector("#customColorSelectCanvas")

const colorDisplay = document.querySelector(".currentColorDisplay")

const widthInput = document.querySelector("#widthInp")
const widthText = document.querySelector("#lineWidthText")
const widthDisplay = document.querySelector("#lineWidthDisplay")

const settingDiv = document.querySelector(".settingsDiv")

const saveBtn = document.querySelector("#save")
const paintBtn = document.querySelector("#paintBrush")
const eraseBtn = document.querySelector("#erase")
const deleteBtn = document.querySelector("#delete")
const settingBtn = document.querySelector("#settingBtn")

const tools = document.querySelectorAll(".toolSelectButton")

const btnSound1 = new Audio("Sounds/btn1.mp3")
const btnSound2 = new Audio("Sounds/btn2.mp3")
const btnSound3 = new Audio("Sounds/btn3.mp3")
const btnSound4 = new Audio("Sounds/btn4.mp3")
const btnSound5 = new Audio("Sounds/btn5.mp3")
const btnSound6 = new Audio("Sounds/btn6.mp3")
const stepSound = new Audio("Sounds/step.mp3")

btnSound1.volume = 0.3
btnSound2.volume = 0.3
btnSound3.volume = 0.1
btnSound4.volume = 0.5
btnSound5.volume = 0.1
btnSound6.volume = 0.1
stepSound.volume = 0.04

tools.forEach(tool => {
    tool.addEventListener("click", () => {
        if (tool.classList.contains("modeTool")) {
            btnSound3.currentTime = 0
            btnSound3.play()
            tools.forEach(t => t.classList.remove("selected"));
            tool.classList.add("selected");
        } else {
            btnSound4.currentTime = 0
            btnSound4.play()
        }
    })
})

function changeLineWidth(width) {
    lineWidth = `${width}`
    widthText.textContent = `${width}`
    ctx.lineWidth = lineWidth * 2
    widthDisplay.style.height = `${width * 2}px`
    widthDisplay.style.borderRadius = `${width}px`
}

function changeDrawColor(selectedColor) {
    colorDisplay.style.backgroundColor = `${selectedColor}`
    color = `${selectedColor}`
    ctx.strokeStyle = color
    ctx.fillStyle = color
}

colorBtns.forEach(colorBtn => {
    colorBtn.addEventListener("click", () => {
        btnSound6.currentTime = 0
        btnSound6.play()
        colorMenuOpened = false
        colorMenu.style.aspectRatio = 1 / 1
        colorMenu.style.backgroundColor = "#8a8a8aff"
        menuClickFalse.style.left = "0"
        menuClickTrue.style.left = "-100%"
        colorMenu.style.cursor = "pointer"
        if (colorBtn.id == "red") {
            changeDrawColor("#ff5555")
        } else if (colorBtn.id == "cyan") {
            changeDrawColor("#55ebff")
        } else if (colorBtn.id == "green") {
            changeDrawColor("#55ff7f")
        } else if (colorBtn.id == "yellow") {
            changeDrawColor("#ffe055")
        } else if (colorBtn.id == "blue") {
            changeDrawColor("#3b56f1")
        } else if (colorBtn.id == "customColorSelect") {
            customColor.addEventListener("input", (e) => {
                changeDrawColor(customColor.value)
            })
        }
    })
})

widthInput.addEventListener("input", (e) => {
    stepSound.currentTime = 0
    stepSound.play()
    changeLineWidth(widthInput.value)
})

let colorMenuOpened = false

colorMenu.addEventListener("mouseup", (e) => {
    if (!colorMenuOpened) {
        colorMenuOpened = true
        colorMenu.style.aspectRatio = 5 / 1
        colorMenu.style.backgroundColor = "#c9c9c9ff"
        menuClickFalse.style.left = "100%"
        menuClickTrue.style.left = "0"
        colorMenu.style.cursor = "default"
        btnSound5.currentTime = 0
        btnSound5.play()
    }
})

let settingsOn = false

settingBtn.addEventListener("mouseup", (e) => {
    if (settingsOn == false) {
        btnSound1.currentTime = 0
        btnSound1.play()
        settingDiv.style.display = "flex"
        settingBtn.style.transform = "rotate(45deg) scale(0.8)"
        settingsOn = true
    } else {
        btnSound2.currentTime = 0
        btnSound2.play()
        settingDiv.style.display = "none"
        settingBtn.style.transform = "rotate(0) scale(1)"
        settingsOn = false
    }
})

customColorCanv.addEventListener("input", (e) => {
    canv.style.backgroundColor = customColorCanv.value
})

let isMouseDown = false;
let color = '#b9b9b9ff';
let lineWidth = 5;
let cords = [];
let currentTool = "brush"

const savedMenu = document.querySelector(".savedMenu")
let saveTimeout

function save(duration) {
    localStorage.setItem("cords", JSON.stringify(cords))
    clearTimeout(saveTimeout)
    savedMenu.style.display = "flex"
    saveTimeout = setTimeout(function () {
        savedMenu.style.opacity = "1"
        saveTimeout = setTimeout(function () {
            savedMenu.style.opacity = "0"
            saveTimeout = setTimeout(function () {
                savedMenu.style.display = "none"
            }, duration)
        }, duration)
    }, duration / 5)

}

document.body.addEventListener("keydown", (e) => {
    if (e.keyCode == 83) {
        save(500)
    }
})

saveBtn.addEventListener("mouseup", (e) => {
    save(500)
})
paintBrush.addEventListener("mousedown", (e) => {
    currentTool = "brush"
    console.log(currentTool);

})
eraseBtn.addEventListener("mousedown", (e) => {
    currentTool = "erase"
    console.log(currentTool);
})
deleteBtn.addEventListener("mouseup", (e) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canv.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    if (isMouseDown && currentTool == "brush") {

        canv.style.cursor = "grabbing"
        cords.push([e.clientX, e.clientY, "brush"]);
        ctx.lineTo(e.clientX, e.clientY)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(e.clientX, e.clientY, lineWidth, 0, 2 * Math.PI, false)
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(e.clientX, e.clientY)
    } else if (isMouseDown && currentTool == "erase") {
        ctx.globalCompositeOperation = 'destination-out';
        canv.style.cursor = "grabbing"
        cords.push([e.clientX, e.clientY, "brush"]);
        ctx.lineTo(e.clientX, e.clientY)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(e.clientX, e.clientY, lineWidth, 0, 2 * Math.PI, false)
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(e.clientX, e.clientY)
    }
})

canv.addEventListener('mouseup', (e) => {
    isMouseDown = false;
    ctx.beginPath();
    cords.push('mouseup');
    canv.style.cursor = "grab"

    console.log(cords);
})
ctx.lineWidth = lineWidth * 2
ctx.strokeStyle = color
ctx.fillStyle = color
canv.addEventListener('mousemove', (e) => {
    if (isMouseDown && currentTool == "brush") {
        ctx.globalCompositeOperation = 'source-over';
        cords.push([e.clientX, e.clientY, "brush", `${color}`, `${lineWidth}`]);
        ctx.lineTo(e.clientX, e.clientY)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(e.clientX, e.clientY, lineWidth, 0, 2 * Math.PI, false)
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(e.clientX, e.clientY)
    } else if (isMouseDown && currentTool == "erase") {
        cords.push([e.clientX, e.clientY, "eraser", `${color}`, `${lineWidth}`]);
        ctx.globalCompositeOperation = 'destination-out';
        cords.push([e.clientX, e.clientY, "brush", `${color}`, `${lineWidth}`]);
        ctx.lineTo(e.clientX, e.clientY)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(e.clientX, e.clientY, lineWidth, 0, 2 * Math.PI, false)
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(e.clientX, e.clientY)
    }
})

// function eraser(x, y, radius) {
//     ctx.globalCompositeOperation = 'destination-out';
//     ctx.beginPath()
//     ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
//     ctx.fill();
//     canv.style.cursor = "grabbing"
// }