import React, { useState, useContext } from "react";
import Alert from 'react-bootstrap/Alert';
import { Container } from "react-bootstrap";
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './styles.css';
// import { UserCircle } from "phosphor-react";
import api from '../../services/api';
import { useHistory } from 'react-router-dom';

import { Context } from '../../Context/AuthContext';

export function Login() {
  const history = useHistory();  

  const { authenticated, singIn } = useContext(Context);
  console.log(`Situação do usuário na página Login: ${authenticated}`);

  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  const [status, setStatus] = useState({
    type: '',
    mensagem: '',
    loading: false
  })

  const valorInput = e => setUser({ 
    ...user, 
    [e.target.name]: e.target.value
  })

  const loginSubmit = async e => {

    e.preventDefault();

    // console.log(user.email);
    // console.log(user.password);
    
    setStatus({
      loading:true,
    })

    const headers = {
      'Content-Type': 'application/json'
      // 'Content-Type':'application/x-www-form-urlencoded'
    }

    await api.post("/users/login", user, {headers})
    .then((response) => {
      // console.log(response);
      setStatus({
        type: 'success',
        mensagem: response.data.mensagem
      })

      localStorage.setItem('token', (response.data.token));

      singIn(true);
      
      return history.push('/categories');

    }).catch((err) => {
      setStatus({
          type: 'error',
          mensagem: 'Erro: tente mais tarde...'
      })
      if(err.response){
        // console.log(err.response);
        setStatus({
          type: 'error',
          mensagem: err.response.data.mensagem,
          loading: false
        })
      }
      // console.log("Erro: tente mais tarde...");  
    })
  }
  return (
    <div className="box">
      
      {/* <Container className="box"> */}
      <Form onSubmit={loginSubmit} className="borderForm">
        {status.type == 'error'? <p>{status.mensagem}</p>: ""}
      {status.type == 'success'? <p>{status.mensagem}</p>: ""}
      {status.loading ? <p>Validando</p>: ""}
        <div className="user">
          
        </div>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="FormLabel">
            Nome de Usuário ou Endereço de Email:
          </Form.Label>
          <Form.Control
            type="email"
            name="email"
            onChange={valorInput}
            placeholder="Digite seu e-mail ou usuário"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Senha:</Form.Label>
          <Form.Control
            type="password"
            name="password"
            onChange={valorInput}
            placeholder="Digite sua senha"
          />
        </Form.Group>
        {status.loading 
        ? <Button variant="dark" disabled type="submit">Acessando</Button>
        : <Button variant="dark"  type="submit">Acessar</Button>}
       
      </Form>
      {/* </Container> */}
    </div>
  );
}