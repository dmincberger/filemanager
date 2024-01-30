let line_counter = document.getElementsByClassName("line_counter")[0]
let text_area = document.getElementById("textarea")
console.log(line_counter.innerHTML);
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

function Test() {
    const options = {

    }
}