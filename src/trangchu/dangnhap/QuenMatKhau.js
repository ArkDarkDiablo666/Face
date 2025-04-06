import React from 'react';
import styled from 'styled-components';

const QuenMatKhau = () => {
  return (
    <Container>
    <FormContainer>
      <div className="form-container">
        <TitleContainer>
          <h2>Quên Mật Khẩu</h2>
        </TitleContainer>
        <form>
            <InputGroup>
            <label htmlFor="email">Email:</label>
            <Input type="text" id="email" name="email" required />
            </InputGroup>
          <ButtonStyled>
          <button className="button" >
            <span className="button-content">Gửi</span>
          </button>
          </ButtonStyled>
          <a href='/dangnhap' style={{color: 'black'}}><h4>Quay lại không ?</h4></a>
        </form>
      </div>
    </FormContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; 
  height: 100vh;
  background-color: #E3FDFD;
  padding: 0 20px; 
  position: relative;
  
`;

const TitleContainer = styled.h2`
  margin-left: 30px;
  margin-bottom: 10px;
  margin-top: -20px;
  margin-right: 60px;
  
`;


const FormContainer = styled.div`
  padding: 20px;
  background-color: #A6E3E9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgb(5, 5, 5);
  width; 6000px;
  align-items: center;
  justify-content: center; 
  
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
  margin-right: 20px;
  margin-left: -5px;

`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonStyled = styled.div`
  .button {
    background: #71C9CE;
    font-family: inherit;
    padding: 0.6em 1.3em;
    font-weight: 900;
    font-size: 18px;
    border: 3px solid black;
    border-radius: 0.4em;
    box-shadow: 0.1em 0.1em;
    padding: auto 20px 20px auto;
    margin-right: 5px;
    width: 350px;
    height: 50px;
  }

  .button:hover {
    transform: translate(-0.05em, -0.05em);
    box-shadow: 0.15em 0.15em;
  }

  .button:active {
    transform: translate(0.05em, 0.05em);
    box-shadow: 0.05em 0.05em;
  }`;

export default QuenMatKhau;