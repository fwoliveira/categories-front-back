import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Context } from '../../Context/AuthContext';
import Table from 'react-bootstrap/Table';
import './styles.css'
import { confirmAlert } from 'react-confirm-alert';
import "react-confirm-alert/src/react-confirm-alert.css";
import { useHistory } from 'react-router-dom';

import { Nav, Navbar, Container, Button, Form } from 'react-bootstrap';

export const ListaCategories = () => {

    const history = useHistory();

    const [data, setData] = useState([]);

    const { authenticated, handleLogout } = useContext(Context);

    const [status, setStatus] = useState({
        type:'',
        mensagem:''
    })

    const confirmDelete = (categories) => {
        confirmAlert({
          title: "CUIDADO !!!!",
          message:
            "deseja realmente excluir a categoria " +
            categories.id +
            "?",
          buttons: [
            {
              label: "Sim",
              onClick: () => handleDelete(categories.id)
            },
            {
              label: "Nao",
              onClick: () => history.push("/categories")
            }
          ]
        });
      };

    const handleDelete = async (idCategories) => {
        console.log(idCategories);

        const valueToken = localStorage.getItem('token');
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }

        await api.delete("/categories/delete/"+idCategories, headers)
        .then( (response) => {
            setStatus({
                type: 'sucess',
                mensagem: response.data.mensagem
            })
            getUsers();
        }).catch( (err) => {
            if(err.response){
                setStatus({
                    type:'error',
                    mensagem: err.response.data.mensagem
                })
            } else {
                setStatus({
                    type:'error',
                    mensagem: 'Erro: tente mais tarde...'
                })
            }
        })
    }

    const getCategories = async () => {

        const valueToken = localStorage.getItem('token');
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }

        await api.get("/categories/all", headers)
            .then( (response) => {
                setData(response.data.categories)
                setStatus({loading: false})
            }).catch( (err) => {
                if(err.response){
                    setStatus({
                        type:'error',
                        mensagem: err.response.data.mensagem
                    })
                } else {
                    setStatus({
                        type:'error',
                        mensagem: 'Erro: tente mais tarde...'
                    })
                }
            })
    }

    useEffect( () => {
        getCategories();
    }, [])
    return (
        <>
        
        <div className="heder1">
            
        <ul className="heder">
        <li>
        <Button variant="outline-success"   className="btn-novaCategoria"> <Link to="/categories/novo" className="linkbtn">Nova Categoria</Link> </Button>   
        </li>
       </ul>
       </div >
       
        <Table striped bordered hover className="table">
                
                <tbody>
                    <tr className="tr-table">
                    <th>#</th>
                    <th>Nome</th>
                    <th>descrição</th>
                    
                    </tr>
                {data.map(categories => (
                        <tr key={categories.id}>
                            <td>{categories.id}</td>
                            <td>{categories.name}</td>
                            <td>{categories.description}</td>
                            <td className="td-editar">
                            <button >
                                <Link className="btn-editar" to={"/categories/editar/"+categories.id}>Editar</Link>
                            </button>
                            <button className="btn-excluir" onClick={() => confirmDelete(categories)} > 
                            Excluir                                
                            </button>
                            </td>
                        </tr>
                ))}
                </tbody>
      </Table>
<hr />
        
       


        
        </>
        
    )
}