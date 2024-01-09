let tworzenie_pliku = document.getElementById("plik")
let file_dialog = document.getElementById("file_dialog")
let folder_dialog = document.getElementById("folder_dialog")
function Plik() {
    file_dialog.showModal()
    event.preventDefault()
}
function Folder() {
    folder_dialog.showModal()
}