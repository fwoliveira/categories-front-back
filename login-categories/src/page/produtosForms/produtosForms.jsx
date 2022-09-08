import React, { useState, useEffect, useContext } from "react";
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import { Form, Button} from 'react-bootstrap';
import './productsForms.css'
import { Context } from '../../Context/AuthContext';
import { Link } from 'react-router-dom';

const initialValue = {
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    categorieId: ''

}

export const ProductsForm = (props) => {

    const { authenticated, handleLogout } = useContext(Context);

    const history = useHistory();

    const [id] = useState(props.match.params.id);
    const [products, setProducts] = useState(initialValue);
    const [categories, setCategories] = useState([]);
    const [acao, setAcao] = useState('Novo');
    const [status, setStatus] = useState({
        type: '',
        mensagem: '',
        loading: false
    })


    const valorInput = e => setProducts({
        ...products,
        [e.target.name]: e.target.value
    })

    const valorSelect = e => setProducts({
        ...products,
        [e.target.name]: e.target.value
    })

   

    const getCategories = async () => {
        const headers = {
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        }

        await api.get("/categories/all" , headers)
            .then((response) => {
                if (response.data.categories) {
                    setCategories(response.data.categories);
                } else {
                    setStatus({
                        type: 'warning',
                        mensagem: 'Categorias não encontrada!!!',
                    })
                }
            }).catch((err) => {
                if (err.response) {
                    setStatus({
                        type: 'error',
                        mensagem: err.response.data.mensagem
                    })
                } else {
                    setStatus({
                        type: 'error',
                        mensagem: 'Erro: Tente mais tarde!'
                    })
                }
            })
    }    
    useEffect( () => {
        getCategories()
    },[])

    useEffect( () => {

        const getProducts = async () => {
  
          const valueToken = localStorage.getItem('token');
          const headers = {
              'headers': {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + valueToken
              }
          }
  
          await api.get("/products/show/"+ id , headers)
              .then( (response) => {
                  if(response.data.products){
                    setProducts(response.data.products);
                    setAcao('Editar')
                  } else {
                    setStatus({
                      type: 'warning',
                      mensagem:'Categorias não encontrada!!!'
                    })
                  } 
                  // setData(response.data.users)
              }).catch( (err) => {
                  if(err.response){
                      setStatus({
                          type:'error',
                          mensagem: err.response.data.mensagem
                      })
                  } else {
                      setStatus({
                          type:'error',
                          mensagem: 'Erro: tente mais tarde produto.....!'
                      })
                  }
              })
      }
      
      if(id) getProducts();
      }, [id])

 
    
    

    const formSubmit = async e => {
        e.preventDefault();
        setStatus({ loading: true });

        const headers = {
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        }

        if(!id){
            await api.post("/products/create", products, headers)
                .then((response) => {
                    setStatus({ loading: false })
                    return history.push('/produtos')
                }).catch((err) => {
                    if (err.response) {
                        setStatus({
                            type: 'error',
                            mensagem: err.response.data.mensagem,
                            loading: false
                        })
                    } else {
                        setStatus({
                            type: 'error',
                            mensagem: 'Erro: tente mais tarde',
                            loading: false
                        })
                    }

                })
        } else {
            await api.put("/products/update", products, headers)
                .then((response) => {
                    setStatus({ loading: false })
                    return history.push('/produtos')
                }).catch((err) => {
                    if (err.response) {
                        setStatus({
                            type: 'error',
                            mensagem: err.response.data.mensagem,
                            loading: false
                        })
                    } else {
                        setStatus({
                            type: 'error',
                            mensagem: 'Erro: tente mais tarde',
                            loading: false
                        })
                    }

                })
        }    

    }

    return (
        <>
        <div className="heder1"> 
         <ul className="heder">
        <li>
        <Button variant="outline-success"   className="btn-novaCategoria"> <Link to="/produtos" className="linkbtn">Sair</Link> </Button>   
        </li>
       </ul>
       </div>
        <div className="box">
           
             {/* <Container className="box"> */}
      <Form onSubmit={formSubmit} className="borderForm">
        {status.type == 'error'? <p>{status.mensagem}</p>: ""}
      {status.type == 'success'? <p>{status.mensagem}</p>: ""}
      {status.loading ? <p>Enviando</p>: ""}
        <div className="user">
         
        </div>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Nome do produto:</Form.Label>
          <Form.Control
          value={products.name}
            type="name"
            name="name"
            onChange={valorInput}
            placeholder="Nome do produto"
          />
        </Form.Group>
    
        <Form.Group className="mb-3" controlId="formBasicDescripition">
          <Form.Label className="FormLabel"> descripition: </Form.Label>
          <Form.Control
            value={products.description}
            type="text"
            name="description"
            onChange={valorInput}
            placeholder="Descrição"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicQuantity">
                        <Form.Label>Quantidade</Form.Label>
                        <Form.Control type="number" name="quantity" value={products.quantity} onChange={valorInput}  />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPrice">
                        <Form.Label>Preço</Form.Label>
                        <Form.Control type="text" name="price" value={products.price} onChange={valorInput}  />
                    </Form.Group>

                    <Form.Select aria-label="categorieId" 
                    name="categorieId"
                    onChange={valorSelect} value={products.categorieId}>
                        <option>Selecione uma Categoria</option>
                        {categories.map(categories => (
                            <option key={categories.id} value={categories.id}>{categories.name}</option>
                        ))}
                    </Form.Select>

                    {status.loading
                        ? <Button variant="primary" disabled type="submit">Enviando...</Button>
                        : <Button variant="primary" type="submit">Enviar</Button>
                    }
      </Form>
      {/* </Container> */}
        </div>
        </>
    )
}