#Author David Martinez Flores
#Llamadas de testeo realizadas con Thunder Client , un plugin de Visual studio que te permite hacer llamadas de todo tipo (DELETE,PUT,GET...) con cuerpo (body) o sin el y de muchos formatos(xml,json...)
#Se utiliza mucho contenido espanol e ingles no se a traducido completo
#Existe una carpeta llamada venv que contiene un entorno virtual por si se requiere (Se utilizo para testear y practicar este ambito)

from flask import Flask,request,jsonify,send_file
import mysql.connector

#from cryptography.fernet import Fernet
#from flask_cors import CORS #Para los CORS por si se necesita al llamar desde otro dominio (Testeanddo al arrancar el index.html independientemente)

#Fernet de cryptography se utiliza para encriptar
#key = Fernet.generate_key()#Ejermplo

#Inicilizamos app como la aplicacion flask
app = Flask(__name__)

#Utilizamos la libreria de flask_cors para habilitar permisos CORS esto es peligroso pero es para localhost
#CORS(app)#Ejemplo para admitir todos los dominios

#Creamos un metodo que nos devuelve la conexion para hacerlo mas facil
def get_connection():
    return mysql.connector.connect(user="root",password="root",host="localhost",database="python",port="3306")

#Creamos una direcciones para peticiones y realizamos lo que contenga su funcion
#Existen diferentes tipos get ,post ,delete ,update entre otros

#Peticion POST , actualmente en uso para ver los datos consultados de un usuario
@app.post('/api/users')
def get_specific_users():
    new_query = request.get_json()#Sacamos el JSON de una request

    #Seleccionamos del request username
    username = new_query["username"]
    #Seleccionamos del request password
    password = new_query["password"]

    conexion = get_connection()
    cursor = conexion.cursor()
    cursor.execute("SELECT password,username,id,fecha FROM usuarios WHERE password = %s and username = %s",(password,username))#Consulta

    #Sacamos los tados y retornamos, estamos utilizando jsonify , pero no es necesario se puede omitir
    datos = cursor.fetchall()
    return datos

#En esta llamada post , creamos usuarios en la bbss mysql
@app.post('/api/user')
def create_users():
    #Uilizamos la libreria de request , para recoger los datos , los recoge como json y los seleccionamos
    new_user = request.get_json()

    #Seleccionamos del request username
    username = new_user["username"]
    #Seleccionamos del request password
    password = new_user["password"]

    conexion = get_connection()
    cursor = conexion.cursor()
    datos=''#Declaramos datos vacio para que retorne algo vacio si hay error
    try:
        #Intentamos insertar con los datos y la fecha y hora actuales
        cursor.execute("INSERT INTO usuarios(password,username,fecha) VALUES(%s,%s,now())",(password,username))
        conexion.commit()#Hacemos el commit para guardar cambios
        #Ahora consultamos para devolver a datos y poder utilizar esta informacion
        cursor.execute("SELECT * FROM usuarios WHERE password='"+password+"' and username='"+username+"'")
        datos = cursor.fetchall()
    except:
        #Si surge un error es porque ya existe dicho usuario cerramos conexion y cursor
        conexion.close()
        cursor.close()

    #Cerramos conexion y cursor    
    cursor.close()
    conexion.close()

    #Retornamos los datos
    return datos

#Peticion DELETE para eliminar un usuario por una id
@app.delete('/api/delete')
def delete_user_byId():

    #Obtenemos el id request desde json
    new_id = request.get_json()

    #Asignamos a la variable id el valor del id
    id=new_id["id"]

    #Obtenemos la conexion
    conexion = get_connection()

    #Obetenemos el cursor
    cursor = conexion.cursor()
    datos=''#Declaramos datos vacio para que retorne algo vacio si hay error
    try:
        #Intentamos buscar el usuario a eliminar para comprobar si existe
        cursor.execute("SELECT * FROM usuarios WHERE id ="+id)
        datos = cursor.fetchall()

        #Borramos
        cursor.execute('DELETE FROM usuarios Where id = %s',(id,))
    except:
        #Si salta error es porque al consultar no existe el usuario y cerramos conexion y cursor
        cursor.close()
        conexion.close()
        #Aqui lanzamos un error para testear luego desde javascript
        raise ValueError ("Error por usuario no existente")#Testeando arrojar errores desde el backend con python

    #Comiteamos la conexion para guardar cambios
    conexion.commit()
    cursor.close()
    conexion.close()

    #Retornamos los datos
    return datos

#Peticion POST para Modificacion de usuarios 
@app.post('/api/modify')
def update_users():

    #Uilizamos la libreria de request , para recoger los datos , los recoge como json y los seleccionamos
    new_user = request.get_json()

    #Seleccionamos datos, recordemos que todo esto nos vendra desde un formulario con los mismos nombres en formato JSON
    oldPassword = new_user["oldPassword"]
    oldUsername = new_user["oldUsername"]
    id = new_user["id"]

    #Seleccionamos del request username
    newUsername = new_user["newUsername"]
    #Seleccionamos del request password
    newPassword = new_user["newPassword"]

    conexion = get_connection()
    cursor = conexion.cursor()
    datos=''#Declaramos datos vacio para que retorne algo vacio si hay error

    print((newPassword,newUsername,id,oldPassword,oldUsername))#Imprimimos solo para testeo
    try:
        #Intentamos primero una consulta para ver que el usuario existe
        cursor.execute("SELECT * FROM usuarios WHERE password='"+oldPassword+"' and username='"+oldUsername+"' and id ="+id)
        datos = cursor.fetchall()
        cursor.execute("UPDATE usuarios SET password = %s , username= %s where id = %s and password= %s and username = %s",(newPassword,newUsername,id,oldPassword,oldUsername))
        conexion.commit()
    except:
        #Si salta error es porque al consultar no existe el usuario y cerramos conexion y cursor sin embargo no se evalua el mismo usuario a cambiar , por si requiere poner el mismo nombre y solo cambiar password
        conexion.close()
        cursor.close()
        #Aqui lanzamos un error para testear luego desde javascript
        raise ValueError ("Error por usuario no existente")#Testeando arrojar errores desde el backend con python
    
    #Imprimimos para testeo
    print(datos)

    #Cerramos
    cursor.close()
    conexion.close()

    #Retornamos los datos
    return datos

#Este es la direccion que ponemos como raiz para el index.html principal
@app.get('/')
def home():
    return send_file("./static/index.html")#Retornamos con send_file que se encarga de mandar el archivo index.html

#Muy importante arrancar la app  
if __name__ == '__main__':
    app.run(debug=True)



#------------FEATURES Y TESTEOS----------------

#Peticion GET . no se utiliza , solamente esta implementada para ver todos los usuarios
@app.get('/api/users')#
def get_users():
    conexion = get_connection()
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM usuarios")
    datos = cursor.fetchall()

    return jsonify(datos)#Utilizamos jsonify para convertir a json , sin embargo no es necesario porque ya estan en este formato , se podria omitir y no lo utilizamos mas , solo para testearlo

#Implementar que se obtenga el id desde la direccion (consulta) , no se utiliza solo testeo
@app.get('/api/user/<id>')
def get_user(id):
    conexion = get_connection()
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM usuarios WHERE id =%s",(id,))
    datos=cursor.fetchall()
    return datos

#Implementar que se obtenga el id desde la direccion (borrado), no se utiliza solo testeo
@app.delete('/api/user/<id>')
def delte_user(id):
    conexion = get_connection()
    cursor = conexion.cursor()
    cursor.execute("DELETE FROM usuarios WHERE id =%s",(id,))
    datos=cursor.fetchall()
    conexion.commit()
    conexion.close()
    cursor.close()
    return datos

