const express = require("express")
const app = express()
const PORT = 3000
app.use(express.static('static'))
const path = require("path")
const formidable = require('formidable');
const hbs = require('express-handlebars');
app.use(express.urlencoded({
    extended: true
}));
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
    console.log(req.body);
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
let sciezka = ""
app.get("/Filemanager_two", function (req, res) {
    let funkcjonalna_sciezka = []
    let funkcjonalna_czesc_sciezki = ""
    //ja w kontekscie przesylam obecna sciezke wybrana w folderze juz
    // strona mi da z powrotem w folderze, pelan sciezka ktore wczesniej wybralem + nazwe folderu

    //nazwa juz zrobiona
    //pelna sciezka, to powinien byc po prostu query["nazwa"]

    if (req.query["nazwa"] != undefined) { // sprawdzam czy w ogole uzytkownik dal mi folder
        sciezka = req.query["nazwa"] //jesli tak, pobieram nazwe katalogu do ktorego wchozde
    }
    sciezka = sciezka.replace(/\\/g, "/")
    context = {}
    pliki = []
    foldery = []
    const filepath = path.join(__dirname, "pliki", sciezka)
    fs.readdir(filepath, (err, files) => {
        if (err) throw err
        files.forEach(element => {
            let plik = `${filepath}\\${element}`.replace(/\\/g, "/");
            fs.lstat(plik, (err, stats) => {
                if (stats.isFile()) {
                    stats["nazwa"] = element
                    stats["path"] = plik
                    stats["sciezka"] = sciezka
                    pliki.push(stats)
                } else if (stats.isDirectory()) {
                    stats["nazwa"] = element
                    stats["path"] = plik
                    stats["sciezka"] = sciezka
                    foldery.push(stats)
                }
            })
        });
        let hierarchia = sciezka.split("/")

        for (let i = 0; i < hierarchia.length; i++) {
            funkcjonalna_czesc_sciezki = path.join(funkcjonalna_czesc_sciezki, hierarchia[i])
            funkcjonalna_sciezka.push({ czesc_sciezki: funkcjonalna_czesc_sciezki, nazwa_sciezki: hierarchia[i] })
        }

        context = {
            hidden: [{ sciecha: funkcjonalna_czesc_sciezki }],
            hierarchia, hierarchia,
            sciezki: funkcjonalna_sciezka,
            pliki: pliki,
            foldery: foldery,
        }
        res.render("Filemanager_two.hbs", context)
    })
})

app.get("/Tworzenie_pliku", function (req, res) {
    console.log(req.query["sciezka"]);
    let nazwa_pliku = req.query["nazwa"]
    let sciecha = req.query["sciezka"]
    let filepath = path.join(__dirname, "pliki", sciecha, nazwa_pliku)
    if (fs.existsSync(filepath)) {
        let now = new Date()
        let currtime = now.getTime()
        filepath = path.join(__dirname, "pliki", sciecha, `Kopia_${nazwa_pliku}_${currtime}`)
        sciezka = sciecha
    }
    fs.writeFile(filepath, "tekst do wpisania", (err) => {
        if (err) throw err
        res.redirect("/Filemanager_two")
    })
})

app.get("/Tworzenie_folderu", function (req, res) {
    console.log(req.query);
    let nazwa_folderu = req.query["nazwa"]
    let sciecha = req.query["sciezka"]
    let filepath = path.join(__dirname, "pliki", sciecha, nazwa_folderu)
    if (fs.existsSync(filepath)) {
        let now = new Date()
        let currtime = now.getTime()
        filepath = path.join(__dirname, "pliki", sciecha, `Kopia_${nazwa_folderu}_${currtime}`)
    }
    fs.mkdir(filepath, (err) => {
        sciezka = sciecha
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
    let filepath = path.join(__dirname, "pliki", sciezka,)
    form.uploadDir = filepath
    form.on("fileBegin", function (name, file) {
        let template = file.path.split("\\")
        template.pop()
        filepath = template.join("\\")
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
    const filepath = path.join(__dirname, "pliki", sciezka, nazwa)
    fs.unlink(filepath, (err) => {
        if (err) throw err
        console.log("czas 1: " + new Date().getMilliseconds());
        res.redirect("/Filemanager_two")
    })
})

app.get('/Usun_folder', function (req, res) {
    let nazwa = req.query["nazwa"]
    const filepath = path.join(__dirname, "pliki", sciezka, nazwa)
    fs.rmdir(filepath, (err) => {
        if (err) throw err
        console.log("czas 1: " + new Date().getMilliseconds());
        res.redirect("/Filemanager_two")
    })
})