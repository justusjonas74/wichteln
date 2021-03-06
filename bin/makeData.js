import * as fs from 'fs';
// Shuffle Arrays
/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffleArray(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
class Game {
    constructor(...args) {
        this.players = args.map((firstName, id) => new Player(firstName, id));
    }
    getIndexOfPlayer(player) {
        return this.players.indexOf(player);
    }
    play() {
        // Reset 
        this.reset();
        // Shuffle all Players
        this.players = shuffleArray(this.players);
        // get Wichtels
        // for (const player of this.players) {
        //     this.becomeWichtel(player)
        // }
        try {
            for (let i = 0; i < this.players.length; i++) {
                const index = this.players.findIndex(player => player.id === i);
                const player = this.players[index];
                this.becomeWichtel(player);
            }
        }
        catch (err) {
            // RETRY 
            if (err instanceof Error)
                console.log(err.message ? err.message : err);
            this.play();
        }
    }
    reset() {
        this.players.forEach(player => {
            player.istWichtelFuer = undefined;
            player.wirdBewichteltVon = undefined;
        });
    }
    print() {
        this.players.forEach(player => {
            console.log(`${player.name} (id: ${player.id}, hash:${player.hashString})==> ${player.istWichtelFuer ? player.istWichtelFuer.name : "undefined"}`);
        });
    }
    saveToDisk() {
        let invitations = "";
        this.players.forEach(player => {
            const fileName = "./public/data/" + player.hashString;
            const content = player.istWichtelFuer ? player.istWichtelFuer.name : "Ooops. Da ist etwas schief gegangen";
            fs.writeFileSync(fileName, content);
            invitations += `Liebe(r) ${player.name}, \num zu erfahren, f??r wen du am Heiligabend der Wichtel bist, gebe auf https://wichteln.francisdoege.com und gib dort deinen pers??nlichen Code ein: ${player.hashString}\n\n`;
        });
        const fileName = "./public/data/ce51a06d-234d-4d18-8696-e6bc1b367eb0";
        fs.writeFileSync(fileName, invitations);
    }
    becomeWichtel(player) {
        const firstPlayerWithoutAWichtel = this.players.find(wichtel => {
            // kann nicht der wichtel f??r sich selbst sein
            const notTheSamePlayer = wichtel.id !== player.id;
            // wird noch nicht bewichtelt
            const hasNoWichtelYet = !wichtel.wirdBewichteltVon;
            return (notTheSamePlayer && hasNoWichtelYet);
        });
        if (!firstPlayerWithoutAWichtel) {
            throw new Error("Geht nicht auf... Versuche es erneut.");
        }
        // Connect everything
        const indexOfPlayer = this.getIndexOfPlayer(player);
        this.players[indexOfPlayer].istWichtelFuer = firstPlayerWithoutAWichtel;
        const indexOfWichtel = this.getIndexOfPlayer(firstPlayerWithoutAWichtel);
        this.players[indexOfWichtel].wirdBewichteltVon = player;
    }
}
class Player {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.hashString = Player.makeid(6);
        this.istWichtelFuer = undefined;
        this.wirdBewichteltVon = undefined;
    }
    static makeid(length) {
        let result = '';
        const characters = '0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
}
const players = shuffleArray([
    "Francis",
    "Heidi",
    "S??ren",
    "Kathleen",
    "Angela",
    "Robby",
    "Marcus"
]);
const game = new Game(...players);
game.play();
game.print();
game.saveToDisk();
