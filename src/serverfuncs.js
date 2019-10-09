export { getArtworkInfo, postArtworkInfo };

var artident = "monalisaleo";
var studentident = "dholley";

// function getArtworkInfo() {
//     fetch('http://localhost:9000/artworks/monalisaleo/', {
//         method: 'get',
//     }).then(function (res) {
//         console.log(res);
//         const artwork = res.json;
//         console.log(artwork);
//         console.log("title: "+artwork["title"]);
//         console.log("artist: "+artwork["artist"]);
//         console.log("year: "+artwork["year"]);
//         console.log("theoreticalprice: "+artwork["theoreticalprice"]);
//         console.log("actualprice: "+artwork["actualprice"]);
//         console.log("hidden: "+artwork["hidden"]);
//         console.log("owner: "+artwork["owner"]);
//         console.log("url: "+artwork["url"]);
//     })
// }

async function getArtworkInfo() {
    const response = await fetch('http://localhost:9000/artworks/monalisaleo/');
    const myJson = await response.json();
    console.log(JSON.stringify(myJson));
    var artwork = JSON.parse(JSON.stringify(myJson))['0'];
    console.log(artwork);
    console.log("title: "+artwork["title"]);
    console.log("artist: "+artwork["artist"]);
    console.log("year: "+artwork["year"]);
    console.log("theoreticalprice: "+artwork["theoreticalprice"]);
    console.log("actualprice: "+artwork["actualprice"]);
    console.log("hidden: "+artwork["hidden"]);
    console.log("owner: "+artwork["owner"]);
    console.log("url: "+artwork["url"]);
}

function postArtworkInfo () {
    fetch('http://localhost:9000/artworks/', {
        method: 'post',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            { title : 'Mona Lisa',
                artist: 'leo',
                year: 1500,
                theoreticalprice: 100,
                actualprice: 200,
                hidden: true,
                owner: 'dholley',
                url: "none"   
            })
    }).then(function (res) {
        console.log(res);
    })
}

function getStudentInfo() {
    fetch('http://localhost:9000/artworks/'+studentident, {
        method: 'get'
    }).then(function (res) {
        const jsonfile = res.json();
    })
}