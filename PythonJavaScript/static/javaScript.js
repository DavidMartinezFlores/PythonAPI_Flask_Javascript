//Author David Martinez Flores
//Se utiliza mucho contenido espanol e ingles no se a traducido completo

//Funcion para ocultar (cerrar) la informacion generada del usuario
function hiddeGeneratedWindow(){
    generated = document.querySelector('#generated')
    generated.setAttribute('hidden','true')
}
//Funcion que hace ocultarse mediante el atributo hidden el div de las cookies o informacion
function hiddeCookies(){
    cookies = document.querySelector('#cookies')
    cookies.setAttribute("hidden","true")
}

//Todas estas funciones de resetForm se puden unificar en una , pero se estan haciendo independientes para fomentar la practica de las mismas
//Funcion para resetear el formulario cuando das click en borrar todo
function resetForm(){
    formulario = document.querySelector("#userForm")
    formulario.reset()
}
//Funcion para resetear el formulario2 cuando das click en borrar todo
function resetForm2(){
    formularioConsultar = document.querySelector("#userFormQuery")
    formularioConsultar.reset()
}
//Funcion para resetear el formulario3 cuando das click en borrar todo
function resetForm3(){
    formularioBorrar = document.querySelector("#userFormDelete")
    formularioBorrar.reset()
}

//Funcion para resetear el formulario4 cuando das click en borrar todo
function resetForm4(){
    formularioModificar = document.querySelector("#userFormModify")
    formularioModificar.reset()
}

//Funcion para avisar si se creo o no el usuario
function avisarRegistro(username)
{
    if (response==null)
    {
        alert("No se a creado el usuario...")
    }else
    {
        alert("! Usuario creado con exito con el nombre -> ( "+username+" ) ! ")
    }

}

//Creamos una variable que almacena la seleccion desde el documento que es toda la hoja , mediante la id selecciona el formulario de html.
formulario = document.querySelector("#userForm")

//Creamos la variable para el formulario de consultas
formularioConsultar = document.querySelector("#userFormQuery")

//Creamos la variable del formulario para borrar
formularioBorrar=document.querySelector('#userFormDelete')

//Creamos la variable del formulario para modificar
formularioModificar=document.querySelector("#userFormModify")

console.log(formulario)//Imprimimos el formulario en consola , para ello recuerda que la etiqueta script que tiene el linkeo de js con html tiene que se la ultima etiqueta en el body
console.log(formularioConsultar)//Impresion de otro formulario
console.log(formularioBorrar)//Impresion de otro formulario
console.log(formularioModificar)//Impresion de otro formulario

//Como el enviar datos es un evento , capturamos el evento del formulario y ponemos asyc porque es asincrono
formulario.addEventListener('submit',async event => 
{
    try{
        event.preventDefault()//Con esta sentencia cancelamos el refresco automatico tras enviar el formulario , pudiendo asi ver los datos en consola

        //Recogemos los valores que queremos en las variables y para ello hacemos uso del objeto formulario[campo].value.
        username = formulario["username"].value
        password = formulario["password"].value
        password2 = formulario["password2"].value

        //Condicional simple que valida que las password son iguales , si no lo son no funcionara y avisara al usuario
        if(!(password==password2)){
            alert("Las contraseñas no coinciden")
        }else{
            //Impresiones
            console.log(username)
            console.log(password)

            //La variable que almacena la respuesta la llamamos response ponemos el await porque son async (arriba) y mediante fetch(ruta) capturamos el return de python
            //Con fetch lancamos la ruta qu tendra python
            response = await fetch('/api/user',
            {
                method:'POST',//Informamos de que se utilizara una llamada de metodo post
                headers:{//Con los headers decimos que se utiliza json es muy importante
                    'Content-Type':'application/json'
                },
                body: JSON.stringify( //Convertimos a json
                    { 
                    username: username, //Para la clave username valor username
                    password: password //Para la clave password el valor password
                })
            })
            //Convertimos el json a datos planos y guardamos en una variable que mostramos por consola
            datos = await response.json()
            console.log(datos)

            avisarRegistro(username)//Llamamos a la funcion para avisar del registro
            
            formulario.reset()//Metodo que fuerza al formulario a volver a estar vacio
        }
    }catch(error){
        alert("Error al crear el usuario , intentelo de nuevo mas tarde \n ---!Puede que este usuario ya exista!---")
        //location.reload();
    }
})

formularioConsultar.addEventListener('submit',async e =>
{
    event.preventDefault()//Evitamos el reseteo por defecto del formulario
    username = formularioConsultar["username"].value
    password = formularioConsultar["password"].value

    response = await fetch('/api/users',
        {
            method:'POST',//Informamos de que se utilizara una llamada de metodo post
            headers:{//Con los headers decimos que se utiliza json es muy importante
                'Content-Type':'application/json'
            },
            body: JSON.stringify( //Convertimos a json
                { 
                username: username, //Para la clave username valor username
                password: password //Para la clave password el valor password
            })
        })
        
        //Convertimos a json datos planos y guardamos en una variable que mostramos por consola
        datos = await response.json()
        
        //Imprimimos mediante un FOR para ver la posibilidad del mismo , no es necesario porque solo es 1 , sin embargo inicialmente se realizo con mas de uno para ver su funcionamiento
        for(let i = 0 ; i<await datos.length;i++)
        {
            console.log("Usuario: "+datos[i][1]);
            console.log("Password: "+datos[i][0]);
            console.log("Id: "+datos[i][2]);
            console.log("fecha: "+datos[i][3]);

            //Lanzamos la info para el usuario
            alert("Usuario: "+datos[i][1]+"\n"+"Password: "+datos[i][0]+"\n"+"Id: "+datos[i][2]+"\nFecha Creacion: "+datos[i][3]+"\n -----! INFORMACION EN EL APARTADO DATOS DEL USUARIO ! -----")
        }
        
        if(datos.length<=0)//Si el tamanyo es menor o igual que 0 , significa que no hay coincidencias
        {
            alert("No hay ningun usuario que coincida...")
        }else{//De lo contrario si hay conincidencias 

            listaVacia = document.querySelector('#emptyDiv')//Seleecionamos la lista emptyList de html
            console.log(listaVacia)//Imprimimos por consola
            
            for(let i = 0 ; i<datos.length;i++)//Iteramos para evitar errores con valores fijos , al solo ser una vez la ejecucion tenemos la misma velocidad , pero si hay algun error no explotara
            {
                //Generamos la informacion en datos de html
                listaVacia.innerHTML=`<div id="generated"><center><fieldset class="greenLigthBackground"><h1 class="redColor">DATOS DEL USUARIO<h1></fielset></center><fieldset class="whiteBackground"><ul id="emptyList"><li>Usuario: ${datos[i][1]} </li><li>Password: ${datos[i][0]} </li><li>Id: ${datos[i][2]} </li><li>Fecha Creacion: ${datos[i][3]} </li></ul><button name="close" class="red" onclick="hiddeGeneratedWindow()">Cerrar Ventana</button></fieldset><div>`
                userDataText=document.querySelector('#userDataText')
            }
        }
        formularioConsultar.reset()//Forcamos el reseteo / limpieza del formulario

})

//Evento de formulario para borrar por id
formularioBorrar.addEventListener('submit',async e =>{
    event.preventDefault()//Quitamos el reseteo por default
    data=[]
    //Recogemos la varaible id
    id = formularioBorrar["id"].value
    response = await fetch('/api/delete',
    {
        method:'DELETE',//Informamos de que se utilizara una llamada de metodo DELETE (Como POST)
            headers:{//Con los headers decimos que se utiliza json es muy importante
                'Content-Type':'application/json'
            },
            body: JSON.stringify( //Convertimos a json
                { 
                id: id, //Para la clave id valor id
            })
    })

    data = await response.json()
    console.log(data)

    if(data.length<=0)
    {
        alert("No se a encontrado usuario con esa ID")
    }else{
        alert('Operacion de borrado completada , si el ID no es el correcto no se borrara nada')
        //location.reload();//Esta linea recarga la pagina si se activa
        alert("--- DATOS DEL USUARIO BORRADO ---\nUsuario: "+data[0][1]+"\n"+"Password: "+data[0][0]+"\n"+"Id: "+data[0][2]+"\nFecha Creacion: "+data[0][3]+"\n")
        //Ocultamos la informacion del usuario a consultar si esta el panel activo
        hiddeGeneratedWindow();
    }
})

//Evento para el formulario de modificacion de usuarios
formularioModificar.addEventListener('submit',async e =>{
    try{
        event.preventDefault()//Quitamos la recarga por defecto del formulario

        //Recogemos datos
        oldUsername=formularioModificar["oldUsername"].value
        oldPassword=formularioModificar["oldPassword"].value
        id=formularioModificar["id"].value
        newUsername=formularioModificar["newUsername"].value
        newPassword=formularioModificar["newPassword"].value
        
        response = await fetch('/api/modify',
        {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(//Convertimos la informacion a JSON , clave valor
            {
                oldUsername:oldUsername,
                oldPassword:oldPassword,
                id:id,
                newUsername,newUsername,
                newPassword,newPassword,
            }    
            )
        }
        )
        //Hacemos este paso para crear un promise , y que salte error si el usuario ya existe o cualquir otro
        datos = await response.json()
        console.log(datos)
        if(datos.length<=0)//Si el tamanyo es menor o igual que 0 , significa que no hay coincidencias
        {
            alert("No hay ningun usuario que coincida...")
        }else{
            alert("--- DATOS SELECCIONADOS ---\nOld Username: "+oldUsername+"\nOld Password: "+oldPassword+"\nID: "+id+"\nNew Username: "+newUsername+"\nNew Password: "+newPassword+"\n----RECUERDA----\n*Si los datos son incorrectos no se realizaran cambios")
            //Ocultamos la informacion del usuario a consultar si esta el panel activo
            hiddeGeneratedWindow();
        }
        
    }catch(error){
        alert("Error al modificar el usuario , intentelo de nuevo mas tarde \n ---!Puede que el nuevo usuario ya exista!---")
        //location.reload();
    }
})
//Evento que se ejecuta nada mas abrir la ventana
window.addEventListener('DOMContentLoaded', async e =>
{
    console.log('evento donde se carga cualquier cosa')
}
)
