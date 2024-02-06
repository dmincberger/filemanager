

function load() {
    let line_counter = document.getElementsByClassName("line_counter")[0]
    let text_area = document.getElementById("textarea")
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    };
    fetch("/get_style", options)
        .then(response => response.json())
        .then(data => {
            data = JSON.parse(data)
            console.log(data);
            line_counter.style.fontSize = `${data["font-size"]}em`
            text_area.style.fontSize = `${data["font-size"]}em`
            line_counter.style.backgroundColor = `${data["background-color"]}`
            text_area.style.backgroundColor = `${data["background-color"]}`
            line_counter.style.color = `${data["color"]}`
            text_area.style.color = `${data["color"]}`
        })
        .catch(error => console.log(error));


    // console.log(dane);
    // let font = dane["font-size"]
    // console.log(font);
}
let line_counter = document.getElementsByClassName("line_counter")[0]
let text_area = document.getElementById("textarea")
text_area.oninput = function () {
    let tabela_linii = []
    let ilosc_linii = text_area.value.split("\n").length
    line_counter.innerHTML = ""

    for (let i = 0; i < ilosc_linii; i++) {
        if (i < 20) {
            tabela_linii.push(`${i % 20}\n`)
            line_counter.innerHTML = tabela_linii.join("\n")
        } else {
            tabela_linii.shift()
            tabela_linii.push(`${i}\n`)
            line_counter.innerHTML = tabela_linii.join("\n")
        }
        // i%19 * math.cell(i/19)?
    }
}

function Zapis() {

    let tekst = document.getElementById("textarea").value
    let sciezka = document.getElementById("sciezka").innerHTML

    tekst = JSON.stringify(tekst)
    let data = JSON.stringify({
        tekst: tekst,
        sciezka: sciezka
    })
    console.log(`TO JEST SCIEZKA DO PLIKU: ${sciezka}`);
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    };
    fetch("/zapisz_plik", options)
        .then(response => response.json())
        .then(data => alert(JSON.stringify(data, null, 5)))
        .catch(error => console.log(error));
}

function Font_mniejszy() {
    let line_counter = document.getElementsByClassName("line_counter")[0]
    let text_area = document.getElementById("textarea")
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    };
    fetch("/mniejszy_font", options)
        .then(response => response.json())
        .then(data => {
            line_counter.style.fontSize = `${data["font-size"]}em`
            text_area.style.fontSize = `${data["font-size"]}em`
        })
        .catch(error => console.log(error));
}

function Font_wiekszy() {
    let line_counter = document.getElementsByClassName("line_counter")[0]
    let text_area = document.getElementById("textarea")
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    };
    fetch("/wiekszy_font", options)
        .then(response => response.json())
        .then(data => {
            line_counter.style.fontSize = `${data["font-size"]}em`
            text_area.style.fontSize = `${data["font-size"]}em`
        })
        .catch(error => console.log(error));
}
load()