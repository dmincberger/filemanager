const express = require("express")
const app = express()
const PORT = 3000
app.use(express.static('static'))
const PNG = require('pngjs').PNG;
const path = require("path")
const cookieparser = require("cookie-parser");
const Datastore = require('nedb')
const { toPng } = require('@rgba-image/png')
const { uuid, fromString } = require('uuidv4');
const formidable = require('formidable');
const hbs = require('express-handlebars');
app.set(express.static(__dirname + '/pliki'));
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));
const fs = require("fs")
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs', extname: '.hbs', partialsDir: "views/partials", }),);
app.use("/pliki", express.static(path.join(__dirname, "/pliki")));
app.use(cookieparser())

const uzytkownicy = new Datastore({
    filename: 'uzytkownicy.db',
    autoload: true
});

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
    form.uploadDir = '/static/upload/'

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
    res.render("login.hbs")
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

//////////////////////////////////////////////////////////////////////// CZESC DRUGA FILEMANAGER! /////////////////////////////////////////////////////////////////
let sciezka = {}
let przykladowe_pliki = {}
let rozszerzenie_obrazow = [
    "png", "jpg", "jpeg", "psd", "raw", "bmp", "PSD", "gif"
]
let przykladowa_sciezka = path.join("static", "file_templates")
fs.readdir(przykladowa_sciezka, (err, files) => {
    for (const f of files) {
        let przykladowe_rozszerzenie = f.split(".").shift()
        let sciezka_do_przykladu = path.join(przykladowa_sciezka, f)
        fs.readFile(sciezka_do_przykladu, 'utf-8', (err, stats) => {
            przykladowe_pliki[przykladowe_rozszerzenie] = stats
        })
    }
})

app.get("/register_redirect", function (req, res) {
    let context = {}
    res.render("register.hbs", context)
})

app.get("/login_redirect", function (req, res) {
    let context = {}
    res.render("login.hbs", context)
})

app.post("/register", function (req, res) {
    /*
    zarerjestrowac i wpisac do bazy - najpierw
    */

    let Login = req.body["Login"]
    let Haslo = req.body["Haslo"]
    let Userid = fromString('Login')
    console.log("USERID: " + Userid);
    // przydaloby sie stworzyc uzytkownika ktorego wpisze w ogole

    const Dane_logowania = {
        Login: Login,
        Haslo: Haslo,
        Userid: Userid
    };
    uzytkownicy.find({ Login: Login }, function (err, docs) {
        if (Object.keys(docs).length != 0) {
            console.log("DOUKUENT: " + Object.keys(docs).length);
            console.log("NUH UH UNUUGEUGERU");
            let context = {
                wiadomosc: "TAKI UZYTKOWNIK JUZ ISTNIEJE!"
            }
            res.render("register.hbs", context)
        } else {
            uzytkownicy.insert(Dane_logowania, function (err, newDoc) {
                console.log("dodano dokument (obiekt):")
                console.log(newDoc)
                console.log("unikalne id dokumentu: " + newDoc._id)
                res.redirect(307, "/login")
            });
        }
    });


})

app.post("/login", function (req, res) {
    let Login = req.body["Login"]
    let Haslo = req.body["Haslo"]
    let Userid = fromString('Login')
    uzytkownicy.find({ Login: Login }, function (err, docs) {
        console.log("DOK: " + docs);
        if (Object.keys(docs).length == 0) {
            console.log("DOUKUENT: " + Object.keys(docs).length);
            console.log("NUH UH UNUUGEUGERU");
            let context = {
                wiadomosc: "NIEPOPRAWNE DANE LOGOWANIA!"
            }
            res.render("login.hbs", context)
        } else {

            let Home_folder = Login
            if (!fs.existsSync(path.join("pliki", Login))) {
                fs.mkdirSync(path.join("pliki", Login))
                console.log("WTF");
                sciezka[Login] = ""
                sciezka[Login] = path.join("pliki", Login)
                res.cookie("dane", JSON.stringify({ Login: Login, Userid: Userid }), { httpOnly: true });
                res.redirect("/Filemanager_two")
            } else {
                sciezka[Login] = ""
                sciezka[Login] = path.join("pliki", Login)
                res.cookie("dane", JSON.stringify({ Login: Login, Userid: Userid }), { httpOnly: true });
                res.redirect("/Filemanager_two")
            }
        }
    });

})

app.get("/Filemanager_two", function (req, res) {
    // let Login = 
    let Login = JSON.parse(req.cookies.dane)["Login"]
    sciezka[Login] = path.join(Login)
    let funkcjonalna_sciezka = []
    let funkcjonalna_czesc_sciezki = ""
    //ja w kontekscie przesylam obecna sciezke wybrana w folderze juz
    // strona mi da z powrotem w folderze, pelan sciezka ktore wczesniej wybralem + nazwe folderu

    //nazwa juz zrobiona
    //pelna sciezka, to powinien byc po prostu query["nazwa"]

    if (req.query["nazwa"] != undefined) { // sprawdzam czy w ogole uzytkownik dal mi folder

        sciezka[Login] = path.join(req.query["nazwa"])

        //jesli tak, pobieram nazwe katalogu do ktorego wchozde
    }
    sciezka[Login] = sciezka[Login].replace(/\\/g, "/")
    context = {}
    pliki = []
    foldery = []
    const filepath = path.join("pliki", sciezka[Login])

    fs.readdir(filepath, (err, files) => {
        if (err) throw err
        files.forEach(element => {
            let plik = `${filepath}\\${element}`.replace(/\\/g, "/");
            fs.lstat(plik, (err, stats) => {
                if (stats.isFile()) {
                    stats["nazwa"] = element
                    stats["path"] = plik
                    stats["sciezka"] = sciezka[Login]
                    pliki.push(stats)
                } else if (stats.isDirectory()) {
                    stats["nazwa"] = element
                    stats["path"] = plik
                    stats["sciezka"] = sciezka[Login]
                    foldery.push(stats)
                }
            })
        });
        let hierarchia = sciezka[Login].split("/")

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
            wyswietlac_pliki: "yes"
        }
        res.render("Filemanager_two.hbs", context)
    })
})

app.get("/Tworzenie_pliku", function (req, res) {
    let Login = JSON.parse(req.cookies.dane)["Login"]

    let tekst_pliku = ""
    let nazwa_pliku = req.query["nazwa"]
    console.log(nazwa_pliku);
    let rozszerzenie = nazwa_pliku.split(".").pop()
    if (przykladowe_pliki.hasOwnProperty(rozszerzenie)) {
        tekst_pliku = przykladowe_pliki[rozszerzenie]
    }
    console.log("QUIRKI: " + req.query["sciezka"]);
    let sciecha = req.query["sciezka"]
    let filepath = path.join("pliki", sciecha, nazwa_pliku)
    if (fs.existsSync(filepath)) {
        let now = new Date()
        let currtime = now.getTime()
        filepath = path.join("pliki", sciecha, `Kopia_${currtime}_${nazwa_pliku}`)
        sciezka[Login] = sciecha
    }
    fs.writeFileSync(filepath, tekst_pliku, { encoding: 'utf-8', flag: "w" })
    res.redirect("/Filemanager_two?nazwa=" + sciecha)
})

app.get("/Tworzenie_folderu", function (req, res) {
    let Login = JSON.parse(req.cookies.dane)["Login"]

    console.log(req.query);
    let nazwa_folderu = req.query["nazwa"]
    let sciecha = req.query["sciezka"]
    let filepath = path.join("pliki", sciecha, nazwa_folderu)
    if (fs.existsSync(filepath)) {
        let now = new Date()
        let currtime = now.getTime()
        filepath = path.join("pliki", sciecha, `Kopia_${nazwa_folderu}_${currtime}`)
    }
    fs.mkdir(filepath, (err) => {
        sciezka[Login] = sciecha
        if (err) throw err
        res.cookie("login", JSON.stringify({ a: 1, b: 2, c: "", d: [] }), { httpOnly: true, maxAge: 30 * 1000 });
        res.redirect("/Filemanager_two?nazwa=" + sciecha)
    })
})

app.post("/Upload_two", function (req, res) {
    let Login = JSON.parse(req.cookies.dane)["Login"]
    let form = formidable({});
    form.multiples = true
    form.keepExtensions = true
    let now = new Date()
    let currtime = now.getTime()
    let filepath = path.join("pliki", sciezka[Login])
    form.uploadDir = filepath
    form.on("fileBegin", function (name, file) {
        let template = file.path.split("\\")
        template.pop()
        console.log(file.mimetype);
        filepath = template.join("\\")
        file.path = path.join(filepath, `${file.name}`)
        if (fs.existsSync(file.path)) {
            file.path = path.join("pliki", `kopia_${currtime}_${file.name}`)
        }
    })
    form.parse(req, function (err, fields, files) {
        let sciecha = filepath.split("\\")
        sciecha.shift()
        sciecha = sciecha.join("\\")
        console.log("FILING: " + sciecha);
        res.redirect("/Filemanager_two?nazwa=" + sciecha)
    });
})

app.get('/Usun_plik', function (req, res) {
    let Login = JSON.parse(req.cookies.dane)["Login"]
    let nazwa = req.query["nazwa"]
    let sciecha = sciezka[Login]
    const filepath = path.join("pliki", sciezka[Login], nazwa)
    fs.unlink(filepath, (err) => {
        if (err) throw err
        console.log("czas 1: " + new Date().getMilliseconds());
        res.redirect("/Filemanager_two?nazwa=" + sciecha)
    })
})

app.get('/Usun_folder', function (req, res) {
    let Login = JSON.parse(req.cookies.dane)["Login"]
    let nazwa = req.query["nazwa"]
    let sciecha = sciezka[Login]
    const filepath = path.join("pliki", sciezka[Login], nazwa)
    fs.rm(filepath, { recursive: true }, (err) => {
        if (err) throw err
        console.log("czas 1: " + new Date().getMilliseconds());
        res.redirect("/Filemanager_two?nazwa=" + sciecha)
    })
})

app.get('/Zmiana_nazwy', function (req, res) {
    let Login = JSON.parse(req.cookies.dane)["Login"]
    let nazwa = req.query["nazwa"]
    let sciecha = req.query["sciezka"]
    console.log("KYRWA SCIECHA: " + sciecha);
    console.log(sciecha == "." ? "lol" : "nie");
    if (sciecha == "." || Login) {
        console.log("trigger");
        res.redirect("/Filemanager_two?nazwa=" + sciecha)
    } else {
        console.log("dalszy trigger");
        let new_sciecha = sciecha.split("\\")
        new_sciecha.pop()
        new_sciecha.push(nazwa)
        new_sciecha = new_sciecha.join("/")
        let filepath_old = path.join("pliki", sciecha)
        let filepath_new = path.join("pliki", new_sciecha)
        if (!fs.existsSync(filepath_new)) {
            fs.rename(filepath_old, filepath_new, (err) => {
                if (err) console.log(err)
                else {
                    sciezka[Login] = new_sciecha
                    res.redirect("/Filemanager_two?nazwa=" + new_sciecha)
                }
            })
        }
        else {
            sciezka = new_sciecha
            res.redirect("/Filemanager_two")
        }
    }
})

app.get("/showfile", function (req, res) {
    let obraz = false
    let effects = [
        { name: "grayscale" },
        { name: "invert" },
        { name: "sepia" },
        { name: "" }
    ]

    let nazwa_pliku = req.query["nazwa"].split("/").pop()
    let rozszerzenie = nazwa_pliku.split(".").pop()

    let sciezka = path.join("pliki", req.query["nazwa"])
    if (rozszerzenie_obrazow.includes(rozszerzenie)) {
        sciezka = sciezka.replace(/\\/g, '/');
        obraz = true
        effects.forEach((element) => {
            element["sciezka"] = sciezka
        })
    }
    console.log(sciezka);
    let zawartosc_pliku = fs.readFileSync(sciezka, { encoding: 'utf-8' })
    let context = {
        wyswietlac_pliki: "",
        zawartosc_pliku: zawartosc_pliku,
        sciezka: sciezka,
        obraz: obraz,
        effects: effects
    }
    console.log(sciezka);
    res.render("showfile.hbs", context)
})

app.post("/zapisz_plik", function (req, res) {
    res.header("content-type", "application/json")
    console.log(req.body["sciezka"])
    let tekst = JSON.parse(req.body["tekst"])
    fs.writeFile(req.body["sciezka"], tekst, (err) => {
        if (err) throw err
        res.send(JSON.stringify("Plik zapisano"));
    })
})

app.post("/mniejszy_font", function (req, res) {
    let sciezka = path.join("static", "css", "style_config.json")
    let zawartosc_styli = fs.readFileSync(sciezka, { encoding: 'utf-8' })
    zawartosc_styli = JSON.parse(zawartosc_styli)
    if (zawartosc_styli['font-size'] > 1.1) {
        zawartosc_styli['font-size'] -= 0.2
        fs.writeFileSync(sciezka, JSON.stringify(zawartosc_styli), { encoding: 'utf-8', flag: "w" })
    }
    res.send(JSON.stringify(zawartosc_styli));
})

app.post("/wiekszy_font", function (req, res) {
    let sciezka = path.join("static", "css", "style_config.json")
    let zawartosc_styli = fs.readFileSync(sciezka, { encoding: 'utf-8' })
    zawartosc_styli = JSON.parse(zawartosc_styli)
    if (zawartosc_styli['font-size'] < 1.9) {
        zawartosc_styli['font-size'] += 0.2
        fs.writeFileSync(sciezka, JSON.stringify(zawartosc_styli), { encoding: 'utf-8', flag: "w" })
    }
    res.send(JSON.stringify(zawartosc_styli));
})
indeks = 0

app.post("/get_style", function (req, res) {
    let tescik = new Date()
    console.log("POSZEDL FETCH O ", tescik.getMilliseconds());
    let sciezka = path.join("static", "css", "style_config.json")
    let zawartosc_styli = fs.readFileSync(sciezka, { encoding: 'utf-8' })
    zawartosc_styli_json = JSON.parse(zawartosc_styli)
    let kolor = JSON.stringify(zawartosc_styli_json["color"][indeks])
    let tlo = JSON.stringify(zawartosc_styli_json["background-color"][indeks])
    let font = JSON.stringify(zawartosc_styli_json["font-size"])
    let styl = { kolor: kolor, tlo: tlo, font: font }
    console.log(indeks);
    res.send(JSON.stringify(styl));
})

app.post("/change_style", function (req, res) {
    res.header("content-type", "application/json")
    let tescik = new Date()
    console.log("POSZEDL FETCH O ", tescik.getMilliseconds());
    let sciezka = path.join("static", "css", "style_config.json")
    let zawartosc_styli = fs.readFileSync(sciezka, { encoding: 'utf-8' })
    zawartosc_styli_json = JSON.parse(zawartosc_styli)
    indeks = zawartosc_styli_json["color"].indexOf(req.body["RGB"]) + 1
    if (indeks == zawartosc_styli_json["color"].length) {
        indeks = 0
    }
    let kolor = JSON.stringify(zawartosc_styli_json["color"][indeks])
    let tlo = JSON.stringify(zawartosc_styli_json["background-color"][indeks])
    let styl = { kolor: kolor, tlo: tlo, indeks: indeks }
    res.send(JSON.stringify(styl))
})

app.get('/Zmiana_nazwy_plik', function (req, res) {
    console.log(req.query);
    let nazwa = req.query["nazwa"]
    let sciecha = req.query["sciezka"]
    let new_sciecha = sciecha.split("\\")
    new_sciecha.pop()
    new_sciecha.push(nazwa)
    new_sciecha = new_sciecha.join("/")
    let przeslanie = new_sciecha.split("pliki")[1]
    console.log(przeslanie);
    if (!fs.existsSync(new_sciecha)) {
        fs.rename(sciecha, new_sciecha, (err) => {
            if (err) console.log(err)
            else {
                res.redirect("/showfile?nazwa=" + przeslanie)
            }
        })
    }
    else {
        res.redirect("/Filemanager_two")
    }
})

app.post('/saveimage', function (req, res) {
    let data = Object.values(req.body["data"]['data']) // pobieram poszczegolne wartosci RGBA kazdego pikselu
    console.log(data);
    let sciezka = req.body["sciezka"] // sciezka do zapisu
    let szerokosc = parseInt(req.body["szerokosc"])
    let wysokosc = parseInt(req.body["wysokosc"])
    const png = new PNG({ width: szerokosc, height: wysokosc, inputHasAlpha: true }) //tworze w pewnym sensie puste płótno o wymiarach i mowie ze jest kanal alpha czyli przezroczystosc
    png.data = Buffer.from(data) //tworze sekwencje bajtów z podanych danych
    const fileStream = fs.createWriteStream(sciezka);
    png.pack().pipe(fileStream) // png.pack() przetwarza dane z png.data zeby zostaly zakodowane w format png, pipe po prostu wynik png.pack wysyla w filestream, ktory wprowadza dane do sciezki ktora wybralismy wczesniej
    fileStream.on('finish', () => {
        console.log('Udalo sie zapis obraz!');
    });

    fileStream.on('error', (err) => {
        console.error('przy zapisie wystapil blad!', err);
    });
})

app.get("/Zmiana_nazwy_obraz", function (req, res) {
    console.log(req.query);
    let nazwa = req.query["nazwa"]
    let rozszerzenie = req.query["sciezka"].split("/").pop().split(".").pop()
    console.log("ROZSZERZENIE" + rozszerzenie);
    let rozszerzenie_sprawdzenie = req.query["nazwa"]
    try {
        rozszerzenie_sprawdzenie = rozszerzenie_sprawdzenie.split(".").pop()
        if (rozszerzenie_sprawdzenie == undefined || !rozszerzenie_obrazow.includes(rozszerzenie_sprawdzenie)) {
            nazwa = nazwa + "." + rozszerzenie
        }
    } catch {

    }
    let sciecha = req.query["sciezka"].replace(/\//g, "\\\\")
    console.log(sciecha);
    let new_sciecha = sciecha.split("\\")
    new_sciecha.pop()
    new_sciecha.push(nazwa)
    new_sciecha = new_sciecha.join("/")
    let przeslanie = new_sciecha.split("pliki")[1]
    console.log(przeslanie);
    if (!fs.existsSync(new_sciecha)) {
        fs.rename(sciecha, new_sciecha, (err) => {
            if (err) console.log(err)
            else {
                res.redirect("/showfile?nazwa=" + przeslanie)
            }
        })
    }
    else {
        res.redirect("/Filemanager_two")
    }
})