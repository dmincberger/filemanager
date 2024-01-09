const express = require("express")
const app = express()
const PORT = 3000
app.use(express.static('static'))
const path = require("path")
const formidable = require('formidable');
const hbs = require('express-handlebars');
const fs = require("fs")
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs', extname: '.hbs',
    partialsDir: "views/partials",
}),
);



let context = {}
let pliczki = []
let id = 1

app.get('/show', function (req, res) {
    przycisk = req.query.id
    for (let i = 0; i < pliczki.length; i++) {
        if (pliczki[i]["id"] == przycisk) {
            sciezka = pliczki[i]["path"]
            break
        }
    }
    res.sendFile(sciezka)
});

app.post('/Upload', function (req, res) {

    let form = formidable({});
    form.multiples = true
    form.keepExtensions = true

    form.uploadDir = __dirname + '/static/upload/'

    form.parse(req, function (err, fields, files) {
        let now = new Date();

        if (files["filesupload"][0] == undefined) {
            if (files["filesupload"]["type"] == "image/jpeg") {
                files["filesupload"]["image"] = "gfx/9055550_bxs_file_jpg_icon.png"
            } else if (files["filesupload"]["type"] == "image/png") {
                files["filesupload"]["image"] = "gfx/7481720_png_file_format_document_icon.png"
            } else if (files["filesupload"]["type"] == "text/plain") {
                files["filesupload"]["image"] = "gfx/3209599_file_text_txt_icon.png"
            } else {
                files["filesupload"]["image"] = "gfx/9023994_question_fill_icon.png"
            }
            let time = now.getTime();
            files["filesupload"]["id"] = id
            files["filesupload"]["savedate"] = time
            console.log(files["filesupload"]["type"]);
            id = id + 1
            console.log("lol");
            pliczki.push(files["filesupload"])
            context = {
                pliki: pliczki
            }
            // console.log(pliczki)
        } else {
            for (let i = 0; i < files['filesupload'].length; i++) {
                let time = now.getTime();
                if (files["filesupload"][i]["type"] == "image/jpeg") {
                    files["filesupload"][i]["image"] = "gfx/9055550_bxs_file_jpg_icon.png"
                } else if (files["filesupload"][i]["type"] == "image/png") {
                    files["filesupload"][i]["image"] = "gfx/7481720_png_file_format_document_icon.png"
                } else if (files["filesupload"][i]["type"] == "text/plain") {
                    files["filesupload"][i]["image"] = "gfx/3209599_file_text_txt_icon.png"
                } else {
                    files["filesupload"][i]["image"] = "gfx/9023994_question_fill_icon.png"
                }
                files["filesupload"][i]["savedate"] = time
                files["filesupload"][i]["id"] = id
                id = id + 1
                pliczki.push(files['filesupload'][i])
            }
            context = {
                pliki: pliczki
            }
        }
        // console.log(files['filesupload'][0]["path"]); // zwraca mi pierwszy plik, oraz sciezke do niego
        res.redirect("/Filemanager")
    });
});

app.get("/Filemanager", function (req, res) {

    res.render("Filemanager.hbs", context)
})

app.get("/reset", function (req, res) {
    pliczki = []
    context = {
    }
    res.render("Filemanager.hbs", context)
})

app.get("/delete", function (req, res) {
    przycisk = req.query.przycisk
    for (let i = 0; i < pliczki.length; i++) {
        if (pliczki[i]["id"] == przycisk) {
            pliczki.splice(i, 1)
            break
        }
    }
    context = {
        pliki: pliczki
    }
    res.render("Filemanager.hbs", context)
})

app.get("/download", function (req, res) {
    res.download(req.query.przycisk)
})

app.get("/info", function (req, res) {
    id_pliku = req.query.id
    let plik
    for (let i = 0; i < pliczki.length; i++) {
        if (pliczki[i]["id"] == id_pliku) {
            plik = pliczki[i]
            break
        }
    }
    res.render("Info.hbs", plik)
})



app.get("/", function (req, res) {
    res.render("Upload.hbs")
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

//////////////////////////////////////////////////////////////////////// CZESC DRUGA FILEMANAGER! /////////////////////////////////////////////////////////////////

let pliki = []
let foldery = []
app.get("/Filemanager_two", function (req, res) {
    context = {}
    pliki = []
    foldery = []
    const filepath = path.join(__dirname, "pliki")
    fs.readdir(filepath, (err, files) => {
        if (err) throw err
        files.forEach(element => {
            let plik = `${filepath}\\${element}`.replace(/\\/g, "/");
            fs.lstat(plik, (err, stats) => {
                if (stats.isFile()) {
                    stats["nazwa"] = element
                    stats["path"] = plik
                    pliki.push(stats)
                } else if (stats.isDirectory()) {
                    stats["nazwa"] = element
                    stats["path"] = plik
                    foldery.push(stats)
                }
            })
        });
        context = {
            pliki: pliki,
            foldery: foldery
        }
        res.render("Filemanager_two.hbs", context)
    })
})

app.get("/Tworzenie_pliku", function (req, res) {
    let nazwa_pliku = req.query["nazwa"]
    let filepath = path.join(__dirname, "pliki", `${nazwa_pliku}`)
    if (fs.existsSync(filepath)) {
        let now = new Date()
        let currtime = now.getTime()
        filepath = path.join(__dirname, "pliki", `Kopia_${nazwa_pliku}_${currtime}`)
    }
    fs.writeFile(filepath, "tekst do wpisania", (err) => {
        if (err) throw err
        res.redirect("/Filemanager_two")
    })
})

app.get("/Tworzenie_folderu", function (req, res) {
    let nazwa_folderu = req.query["nazwa"]
    let filepath = path.join(__dirname, "pliki", `${nazwa_folderu}`)
    if (fs.existsSync(filepath)) {
        let now = new Date()
        let currtime = now.getTime()
        filepath = path.join(__dirname, "pliki", `Kopia_${nazwa_folderu}_${currtime}`)
    }
    fs.mkdir(filepath, (err) => {
        if (err) throw err
        res.redirect("/Filemanager_two")
    })
})

app.post("/Upload_two", function (req, res) {
    let form = formidable({});
    form.multiples = true
    form.keepExtensions = true
    let now = new Date()
    let currtime = now.getTime()
    const filepath = path.join(__dirname, "pliki")
    form.uploadDir = filepath
    form.on("fileBegin", function (name, file) {
        file.path = path.join(filepath, `${file.name}`)
        if (fs.existsSync(file.path)) {
            file.path = path.join(__dirname, "pliki", `kopia_${file.name}_${currtime}`)
        }
    })
    form.parse(req, function (err, fields, files) {
        res.redirect("/Filemanager_two")
    });
})

app.get('/Usun_plik', function (req, res) {
    let nazwa = req.query["nazwa"]
    const filepath = path.join(__dirname, "pliki", `${nazwa}`)
    fs.unlink(filepath, (err) => {
        if (err) throw err
        console.log("czas 1: " + new Date().getMilliseconds());
        res.redirect("/Filemanager_two")
    })
})

app.get('/Usun_folder', function (req, res) {
    let nazwa = req.query["nazwa"]
    const filepath = path.join(__dirname, "pliki", `${nazwa}`)
    fs.rmdir(filepath, (err) => {
        if (err) throw err
        console.log("czas 1: " + new Date().getMilliseconds());
        res.redirect("/Filemanager_two")
    })
})