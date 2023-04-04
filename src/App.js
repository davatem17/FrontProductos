import React, {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';
import { format } from 'date-fns';
import {makeStyles} from '@material-ui/core/styles';
import {Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField} from '@material-ui/core';
import {Edit, Delete} from '@material-ui/icons';

const baseUrl='http://localhost:3000/'

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

  const handleChange=e=>{
    const {name, value}=e.target;
    setConsolaSeleccionada(prevState=>({
      ...prevState,
      [name]: value
    }))
    console.log(consolaSeleccionada);
  }


  const peticionGet=async()=>{
    await axios.get(`${baseUrl}productos`)
    .then(response=>{
      setData(response.data);
    })
  }

  const peticionPost=async()=>{
    await axios.post(baseUrl+"productos/", consolaSeleccionada)
    .then(response=>{
      setData(data.concat(response.data))
      abrirCerrarModalInsertar()
      setRecargar(true)
    })
    setRecargar(false)
  }

  const peticionPut=async()=>{
    await axios.put(baseUrl+"productos/"+consolaSeleccionada.id, consolaSeleccionada)
    .then(response=>{
      var dataNueva=data;
      dataNueva.forEach(consola=>{
        if(consolaSeleccionada.id===consola.id){
          consola.nombre=consolaSeleccionada.nombre;
          consola.fechaElab=format(new Date(consolaSeleccionada.fechaElab), 'dd/MM/yyyy');
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
  }

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"productos/"+consolaSeleccionada.id)
    .then(response=>{
      setData(data.filter(consola=>consola.id!==consolaSeleccionada.id));
      abrirCerrarModalEliminar();
    })
  }

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

  useEffect(()=>{
    peticionGet();
  },[recargar])

  const bodyInsertar=(
    <div className={styles.modal}>
      <h3>Agregar Nueva Consola</h3>
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

  const bodyEditar=(
    <div className={styles.modal}>
      <h3>Editar Consola</h3>
      <TextField name="nombre" className={styles.inputMaterial} label="Nombre" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.nombre}/>
      <br />
      <label>Fecha de Elaboracion</label><br />
      <label>{consolaSeleccionada.fechaElab}</label>
      <TextField name="fechaElab" type='date' className={styles.inputMaterial}  onChange={handleChange} value={consolaSeleccionada.fechaElab} InputLabelProps={{
          shrink: true,
        }}/>
      <br />
      <label>Fecha de Caducidad</label><br />
      <label>{consolaSeleccionada.fechaCad}</label>
      <TextField name="fechaCad" type='date' className={styles.inputMaterial}  onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.fechaCad}/>
      <br />
      <TextField name="cantidad" className={styles.inputMaterial} label="Cantidad" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.cantidad}/>
      <br />
      <TextField type='date' name="descripcion" className={styles.inputMaterial}  onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.descripcion}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPut()}>Editar</Button>
        <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEliminar=(
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar la consola <b>{consolaSeleccionada && consolaSeleccionada.nombre}</b> ? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>peticionDelete()} >Sí</Button>
        <Button onClick={()=>abrirCerrarModalEliminar()}>No</Button>

      </div>

    </div>
  )
    console.log(data)

  return (
    <div className="App">
      <br />
    <Button onClick={()=>abrirCerrarModalInsertar()}>Insertar</Button>
      <br /><br />
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
