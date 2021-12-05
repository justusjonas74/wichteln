import * as fs from 'fs'
import rimraf from 'rimraf'


// Shuffle Arrays
/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
 function shuffleArray<T>(a:T[]):T[] {
    var j:number, x:T, i:number;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

class Game {



    private players: Player[]

    constructor(...args: string[]) {
        this.players = args.map((firstName, id) => new Player(firstName, id))
    }

    private getIndexOfPlayer(player:Player) : number {
        return this.players.indexOf(player)
    }

    play() {

        // Reset 
        this.reset()

        // Shuffle all Players
        this.players = shuffleArray(this.players)
        
        // get Wichtels
        // for (const player of this.players) {
        //     this.becomeWichtel(player)
        // }
        try {    
            for (let i = 0; i < this.players.length; i++) {
                const index = this.players.findIndex(player => player.id === i)
                const player = this.players[index]
                this.becomeWichtel(player)
            }
        } catch (err:any) {
            // RETRY 
            if (err instanceof Error)
            console.log(err.message ? err.message : err)
            this.play()
        }
    }

    isMarried(name:string, name2:string){
        if(name==="Robby" && name2==="Angela") {return true} 
        else if(name2==="Robby" && name==="Angela") {return true} 
        else if(name2==="Kathleen" && name==="Sören") {return true} 
        else if(name==="Kathleen" && name2==="Sören") {return true}
        else if(name==="Heidi" && name2==="Francis") {return true}
        else if(name2==="Heidi" && name==="Francis") {return true}
        else {return false}
    }

    reset() {
        this.players.forEach(player=>{
            player.istWichtelFuer = undefined
            player.wirdBewichteltVon = undefined
        })
    }

    print(){
        this.players.forEach(player=>{
            console.log(`${player.name} (id: ${player.id}, hash:${player.hashString})==> ${player.istWichtelFuer ? player.istWichtelFuer.name:"undefined"}`)
        })
    }

    saveToDisk(){
        rimraf.sync("./public/data/*")
        let invitations = "<html><body>"
        this.players.forEach(player => {
            const fileName = "./public/data/" +  player.hashString
            const content = player.istWichtelFuer ? player.istWichtelFuer.name : "Ooops. Da ist etwas schief gegangen"
            fs.writeFileSync(fileName,content)

            invitations += `<p>Liebe(r) ${player.name}, <br/>um zu erfahren, für wen du am Heiligabend der Wichtel bist, gehe auf <a href="https://wichteln.francisdoege.com">https://wichteln.francisdoege.com</a>und gib dort deinen persönlichen Code ein: ${player.hashString}</p>`
        })
        invitations += "</body></html>"
        const fileName = "./public/data/ce51a06d-234d-4d18-8696-e6bc1b367eb0" 
        fs.writeFileSync(fileName, invitations)
        



    }

    private becomeWichtel(player:Player) {
        const firstPlayerWithoutAWichtel: Player|undefined = this.players.find(wichtel => {
            // kann nicht der wichtel für sich selbst sein
            const notTheSamePlayer = wichtel.id !== player.id
            // wird noch nicht bewichtelt
            const hasNoWichtelYet = !wichtel.wirdBewichteltVon
            const isNotMarriedWithWichtel = !this.isMarried(player.name,wichtel.name)
            return (notTheSamePlayer && hasNoWichtelYet && isNotMarriedWithWichtel)
        })
        if (!firstPlayerWithoutAWichtel){
            throw new Error("Geht nicht auf... Versuche es erneut.")
        }

        // Connect everything
        const indexOfPlayer = this.getIndexOfPlayer(player)
        this.players[indexOfPlayer].istWichtelFuer = firstPlayerWithoutAWichtel

        const indexOfWichtel = this.getIndexOfPlayer(firstPlayerWithoutAWichtel)
        this.players[indexOfWichtel].wirdBewichteltVon = player
    }
}

class Player {
    public hashString: string

    // Wichtel ist derjenige der schenkt 
    public istWichtelFuer: Player | undefined
    public wirdBewichteltVon: Player | undefined


    constructor(
        public name: string,
        public id: number,

    ) {
        this.hashString = Player.makeid(6)
        this.istWichtelFuer = undefined
        this.wirdBewichteltVon = undefined
    }

    private static makeid(length:number) {
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
    "Sören",
    "Kathleen",
    "Angela",
    "Robby",
    "Marcus"
])
const game = new Game(...players)


game.play()
// game.print()
game.saveToDisk()


// Fixes : cannot be compiled under '--isolatedModules'
export {} 