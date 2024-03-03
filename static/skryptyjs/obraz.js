

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d', { willReadFrequently: true })
const mainImageDiv = document.getElementById("divcanvas")
const revealpanel = document.getElementById("revealpanel")
const panel = document.getElementById("panel")
const saveimage = document.getElementById("saveimage")
const sciezka = document.getElementById("sciezka").innerHTML
console.log(sciezka);
let image = new Image()
image.src = mainImageDiv.style.backgroundImage.slice(4, -1).replace(/"/g, "")
console.log(image);
let szerokosc
let wysokosc
image.onload = function () {
    context.getContextAttributes["willReadFreguqently"] = "true"
    console.log(context.getContextAttributes());
    console.log(context);
    szerokosc = image.width
    wysokosc = image.height
    mainImageDiv.style.width = `${szerokosc}px`
    mainImageDiv.style.height = `${wysokosc}px`
    canvas.width = mainImageDiv.clientWidth;
    canvas.height = mainImageDiv.clientHeight;
    // context.filter = "invert(100%)"; // przykładowy filtr
    context.drawImage(image, 0, 0, canvas.width, canvas.height); // obrazek z filtrem widocznym na canvasie
    mainImageDiv.appendChild(canvas)

    let isDrawing = false;

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, false);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, true);
        }
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    canvas.addEventListener('mouseleave', () => {
        isDrawing = false;
    });



    function draw(x, y, isDragging) {
        context.lineWidth = 5;
        context.lineCap = 'round';
        context.strokeStyle = 'black';

        if (!isDragging) {
            context.moveTo(x, y);
        } else {
            context.strokeStyle = "blue"
            context.lineTo(x + 1, y);
            context.stroke();
        }
    }
}
for (const element of panel.children) {
    element.addEventListener("click", () => {
        context.filter = element.style.filter
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
    })
}
revealpanel.addEventListener("click", () => {
    if (window.getComputedStyle(document.getElementById("panel")).visibility == "hidden") {
        panel.style.visibility = "visible"
        panel.style.width = "200px"
        for (const element of panel.children) {
            element.style.width = "200px"
            element.style.height = "50px"
            element.style.cursor = "pointer"
        }
    } else {
        panel.style.visibility = "hidden"
        panel.style.width = "0px"
        panel.style.transition = "width 1s"

        for (const element of panel.children) {
            element.style.width = "0px"
            element.style.height = "0px"
            element.style.cursor = "pointer"
        }
    }
})
let test = canvas.toDataURL()
saveimage.addEventListener("click", () => {

    console.log(test);
    let data = context.getImageData(0, 0, canvas.width, canvas.height)
    const body = JSON.stringify({
        data: data,
        sciezka: sciezka,
        szerokosc: szerokosc,
        wysokosc: wysokosc
    })
    const headers = { "Content-Type": "application/json" }
    fetch("/saveimage", { method: "post", body, headers })
        .then(response => response.json())
        .then(
            data => {
                console.log("plik zapisany")
            }
        )
})

function Zmiana_nazwy_obraz() {
    let Zmiana_nazwy = document.getElementById("zmiana_dialog_obraz")
    Zmiana_nazwy.showModal()
}

function Stop_zmiana_obraz() {
    let Zmiana_nazwy = document.getElementById("zmiana_dialog_obraz")
    Zmiana_nazwy.close()
}