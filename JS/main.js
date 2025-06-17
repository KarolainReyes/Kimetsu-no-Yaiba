//VISTA PRINCIPAL

//funcion para cambiar imagenes

if document.body.classList.contains ("pag-inicio") {document.addEventListener('DOMContentLoaded', () =>{
    const botonCambio =document.getElementById ('')
})}
let urls = ["./IMG/primeraVista.jpg", "./IMG/segundaVista.jpg", "./IMG/terceraVista.jpg", "./IMG/cuartaVista.jpg", "./IMG/quintaVista.jpg"];

const imagen_principal = document.getElementById("imagen-principal");
const botonCambio = document.getElementById("boton-cambio");
let indice = 0;
botonCambio.addEventListener("click", cambiarFoto);
function cambiarFoto() {
    console.log(indice)
    if (indice<=2){
        imagen_principal.setAttribute("src",urls[indice])
        indice++;
        if (indice>2){indice=0}
    }

}