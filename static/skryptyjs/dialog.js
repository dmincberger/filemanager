let tworzenie_pliku = document.getElementById("plik")
let file_dialog = document.getElementById("file_dialog")
let folder_dialog = document.getElementById("folder_dialog")
let zmiana_nazwy = document.getElementById("zmiana_dialog")
let Cancel_plik = document.getElementById("Cancel_plik")
let Cancel_zmiana = document.getElementById("Cancel_zmiana")
let Cancel_folder = document.getElementById("Cancel_folder")
function Plik() {
    file_dialog.showModal()
}
function Folder() {
    folder_dialog.showModal()
}

function Zmiana() {
    zmiana_nazwy.showModal()
}

function Stop_zmiana() {
    zmiana_nazwy.close()
}
function Stop_plik() {
    file_dialog.close()
}
function Stop_folder() {
    folder_dialog.close()
}