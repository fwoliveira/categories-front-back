import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Context } from '../../Context/AuthContext';
import Table from 'react-bootstrap/Table';
import './styles.css'
import { confirmAlert } from 'react-confirm-alert';
import { useHistory } from 'react-router-dom';

import { Nav, Navbar, Container, Button, Form } from 'react-bootstrap';

export const ListaProducts = () => {

    const history = useHistory();

    const [data, setData] = useState([]);

    const { authenticated, handleLogout } = useContext(Context);

    const [status, setStatus] = useState({
        type:'',
        mensagem:''
    })

    const confirmDelete = (products) => {
        confirmAlert({
          title: "CAUTION !!!!",
          message:
            "Deseja deletar esse produto " +
            products.id +
            "?",
          buttons: [
            {
              label: "Sim",
              onClick: () => handleDelete(products.id) 
            },
            {
              label: "Não",
              onClick: () => history.push("/produtos")
            }
          ]
        });
      };

    const handleDelete = async (idProducts) => {
        console.log(idProducts);

        const valueToken = localStorage.getItem('token');
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }

        await api.delete("/products/delete/"+idProducts, headers)
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

    const getProducts = async () => {
        
        const valueToken = localStorage.getItem('token');
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }

        await api.get("/products/all" , headers)
            .then( (response) => {
                setData(response.data.products);
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
        getProducts();
    }, [])

    return(
        <>
        
        <div className="heder1">
            
        <ul className="heder">
        <li>
        <Button variant="outline-success"   className="btn-novaCategoria"> <Link to="/categories" className="linkbtn">Categorias</Link> </Button> 
        </li>
        <li>
        <Button variant="outline-success"   className="btn-novaCategoria"> <Link to="/products/novo" className="linkbtn">Novo produto</Link> </Button>
        </li>
       </ul>
       </div >
       
        <Table striped bordered hover className="table">
                
                <tbody>
                    <tr className="tr-table">
                    <th>#</th>
                        <th>Nome</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>CategorieId</th>
                    
                    </tr>
                {data.map(products => (
                        <tr key={products.id}>
                            <td>{products.id}</td>
                            <td>{products.name}</td>
                            <td>{products.description}</td>
                            <td>{products.quantity}</td>
                            <td>{products.price}</td>
                            <td>{products.categorieId}</td>
                            <td className="td-editar">
                            <button >
                                <Link className="btn-editar" to={"/products/editar/"+products.id}>Editar</Link>
                            </button>
                            <button className="btn-excluir" onClick={() => confirmDelete(products)} > 
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