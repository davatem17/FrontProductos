import React, {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';
import {makeStyles} from '@material-ui/core/styles';
import {Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField} from '@material-ui/core';
import {Edit, Delete} from '@material-ui/icons';

const baseUrl='http://localhost:3000/'

//Estilos CSS
const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos:{
    cursor: 'pointer'
  }, 
  inputMaterial:{
    width: '100%'
  }
}));

function App() {
  //States de la aplicacion 
  const styles= useStyles();
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);
  const [recargar, setRecargar] = useState(false);
  const [consolaSeleccionada, setConsolaSeleccionada]=useState({
    nombre: '',
    fechaElab: '',
    fechaCad: '',
    cantidad: 0,
    descripcion: ''
  })
  //Cambio en los input
  const handleChange=e=>{
    const {name, value}=e.target;
    setConsolaSeleccionada(prevState=>({
      ...prevState,
      [name]: value
    }))
    console.log(consolaSeleccionada);
  }

  //Peticion de carga de los productos
  const peticionGet=async()=>{
    await axios.get(`${baseUrl}productos`)
    .then(response=>{
      setData(response.data);
    })
  }

  //Peticion para crear los propductos 
  const peticionPost=async()=>{
    await axios.post(baseUrl+"productos/", consolaSeleccionada)
    .then(response=>{
      setData(data.concat(response.data))
      console.log(response.data)
      abrirCerrarModalInsertar()
      setRecargar(true)
    })
    setRecargar(false)
  }

  //Peticion para editar los prodcutos
  const peticionPut=async()=>{
    await axios.put(baseUrl+"productos/"+consolaSeleccionada.id, consolaSeleccionada)
    .then(response=>{
      var dataNueva=data;
      dataNueva.forEach(consola=>{
        if(consolaSeleccionada.id===consola.id){
          consola.nombre=consolaSeleccionada.nombre;
          consola.fechaElab=consolaSeleccionada.fechaElab;
          consola.fechaCad=consolaSeleccionada.fechaCad;
          consola.cantidad=consolaSeleccionada.cantidad;
          consola.descripcion=consolaSeleccionada.descripcion;
        }
      })
      setData(dataNueva);
      abrirCerrarModalEditar();
      setRecargar(true)
    })
    setRecargar(false)
    setConsolaSeleccionada({})
  }

  //Peticion para borrar los productos
  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"productos/"+consolaSeleccionada.id)
    .then(response=>{
      setData(data.filter(consola=>consola.id!==consolaSeleccionada.id));
      abrirCerrarModalEliminar();
    })
  }

  //Funciones para abrir y cerrar los modales de la aplicacion 
  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const seleccionarConsola=(consola, caso)=>{
    setConsolaSeleccionada(consola);
    (caso==='Editar')?abrirCerrarModalEditar():abrirCerrarModalEliminar()
  }

  //Funcion para actualizar los productos 
  useEffect(()=>{
    peticionGet();
  },[recargar])

  //Cuerpo del formulario para insertar los productos
  const bodyInsertar=(
    <div className={styles.modal}>
      <h3>Agregar Nuevo Producto</h3>
      <TextField name="nombre" className={styles.inputMaterial} label="Nombre" onChange={handleChange}/>
      <br />
      <label>Fecha de Elaboracion</label>
      <TextField type='date' name="fechaElab" className={styles.inputMaterial} placeholder="Fecha de Elaboracion" onChange={handleChange}/>
      <br />
      <label>Fecha de Caducidad</label>
      <TextField type='date' name="fechaCad" className={styles.inputMaterial} placeholder="Fecha de Caducidad" onChange={handleChange}/>
      <br />
      <TextField type='number' name="cantidad" className={styles.inputMaterial} label="Cantidad" onChange={handleChange}/>
      <br />
      <TextField name="descripcion" className={styles.inputMaterial} label="Descripcion" onChange={handleChange}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPost()}>Insertar</Button>
        <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )

  //Cuerpo del formulario para editar los productos 
  const bodyEditar=(
    <div className={styles.modal}>
      <h3>Editar Producto</h3>
      <TextField name="nombre" className={styles.inputMaterial} label="Nombre" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.nombre}/>
      <br />
      <label>Fecha de Elaboracion</label><br />
      <TextField name="fechaElab" type='date' className={styles.inputMaterial}  onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.fechaElab}/>
      <br />
      <label>Fecha de Caducidad</label><br />
      <TextField name="fechaCad" type='date' className={styles.inputMaterial}  onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.fechaCad}/>
      <br />
      <TextField name="cantidad" className={styles.inputMaterial} label="Cantidad" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.cantidad}/>
      <br />
      <TextField  name="descripcion" className={styles.inputMaterial} label="Descripcion" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.descripcion}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPut()}>Editar</Button>
        <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  )

  //Cuerpo para eliminar los productos
  const bodyEliminar=(
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar el producto <b>{consolaSeleccionada && consolaSeleccionada.nombre}</b> ? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>peticionDelete()} >Sí</Button>
        <Button onClick={()=>abrirCerrarModalEliminar()}>No</Button>

      </div>

    </div>
  )
    console.log(data)

  //Cuerpo delo listado de los productos
  return (
    <div className="App">
      <br />
    <Button onClick={()=>abrirCerrarModalInsertar()}>Insertar</Button>
      <h1>Productos</h1>
     <TableContainer>
       <Table>
         <TableHead>
           <TableRow>
             <TableCell>Nombre</TableCell>
             <TableCell>Fecha Elaboracion</TableCell>
             <TableCell>Fechas Caducidad</TableCell>
             <TableCell>Cantidad</TableCell>
             <TableCell>Descripcion</TableCell>
             <TableCell>Opciones</TableCell>
           </TableRow>
         </TableHead>

         <TableBody>
           {data.map(consola=>(
             <TableRow key={consola.id}>
               <TableCell>{consola.nombre}</TableCell>
               <TableCell>{consola.fechaElab}</TableCell>
               <TableCell>{consola.fechaCad}</TableCell>
               <TableCell>{consola.cantidad}</TableCell>
               <TableCell>{consola.descripcion}</TableCell>
               <TableCell>
                 <Edit className={styles.iconos} onClick={()=>seleccionarConsola(consola, 'Editar')}/>
                 &nbsp;&nbsp;&nbsp;
                 <Delete  className={styles.iconos} onClick={()=>seleccionarConsola(consola, 'Eliminar')}/>
                 </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     </TableContainer>
     
     <Modal
     open={modalInsertar}
     onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
     </Modal>

     <Modal
     open={modalEditar}
     onClose={abrirCerrarModalEditar}>
        {bodyEditar}
     </Modal>

     <Modal
     open={modalEliminar}
     onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
     </Modal>
    </div>
  );
}

export default App;
