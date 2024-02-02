const  express = require(  'express')
const {engine}= require ('express-handlebars')
const path = require( 'path')
//const {fetch} = require('node-fetch')
let fetch;
import('node-fetch').then(({ default: fetched }) => {
    fetch = fetched;
    // Rest of your code that uses fetch goes here
}).catch(err => {
    console.error('Failed to load node-fetch:', err);
});

const helpers = require('handlebars-helpers')()
const bodyParser = require('body-parser')

//import  {fileURLToPath} from 'url'

//const __filename = fileURLToPath(import.meta.url)
//const __dirname = dirname(__filename)

const PORT = process.env.PORT || 5004
const  app = express()
const catchError = asyncFunction => (...args) => asyncFunction(...args).catch(console.error)

const getAllPokemon =catchError( async ()=>{
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=200')
    const  json = await res.json()
    return json
})
const getPokemon =catchError( async (pokemon = 1)=>{
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    const  json = await res.json()
    return json
})

//MiddleWares

app.use(express.static(path.join(__dirname,'public')))
app.engine('hbs', engine({ helpers:helpers,extname:'.hbs'}));
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({extended:false}))




app.get('/',catchError(async (req,res)=>{
    const pokemons = await getAllPokemon()
    res.render('home',{pokemons})
}))

app.post('/search',(req,res)=>{
    const search = req.body.search
    res.redirect(`${search}`)
})

app.get('/notFound',(req,res)=> res.render('notFound'))

app.get('/:pokemon',catchError(async (req,res)=>{
    const search = req.params.pokemon
    const  pokemon = await getPokemon(search)
    if(pokemon){
        res.render('pokemon',{pokemon})
    }else {
        res.redirect('notFound')
    }
}))
//

app.listen(PORT,()=>{console.log(`Server is listening on ${PORT}`)})