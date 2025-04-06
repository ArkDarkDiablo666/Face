// src/trangchu/DashboardGuest.js
import React from 'react';
import { Menu, MenuItem } from 'react-pro-sidebar';
import styled from 'styled-components';
import { House, UserRound as User, CalendarCheck, LogOut } from 'lucide-react';

function TrangCaNhanG() {
  return (
    <Container>
      <div style={{ display: 'flex' }}>
        <SideMenu>
          <Menu>
            <Icon>
              <img src="meme.png" alt="Logo" style={{ width: '50px', height: '50px' }} />
              <Title>Face ID</Title>
            </Icon>
            <MenuItemStyled href="/guest">
              <Icon>
                <House />
                <Title>Trang chủ</Title> {/* Sử dụng TitleBold cho "Trang chủ" */}
              </Icon>
            </MenuItemStyled>
            <MenuItemStyled href="/guest/trang-ca-nhan">
              <Icon>
                <User  />
                <TitleMain>Thông tin cá nhân</TitleMain>
              </Icon>
            </MenuItemStyled>
            <MenuItemStyled href="/guest/xem">
              <Icon>
                <CalendarCheck />
                <Title>Thống kê điểm danh</Title>
              </Icon>
            </MenuItemStyled>
            <MenuItemStyled href="/dangnhap">
              <Icon>
                <LogOut />
                <Title>Đăng xuất</Title>
              </Icon>
            </MenuItemStyled>
          </Menu>
        </SideMenu>
        <Content>
          <h1>Trang cá nhân</h1>
        </Content>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  height: 100vh;
  background-color: #CBF1F5;
  color: rgb(0, 0, 0);
  padding: 10 10 10 20px; 
  position: relative;
`;

const SideMenu = styled.div`
  width: 280px;
  height: 100vh;
  background-color: #A6E3E9; /* Màu nền cho sidebar */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); /* Đổ bóng cho sidebar */
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

const Icon = styled.div`
  display: flex; /* Sử dụng Flexbox để căn giữa */
  align-items: center; /* Căn giữa theo chiều dọc */
  margin: 10px 0; /* Thêm khoảng cách giữa các mục */
  cursor: pointer;
`;

const Title = styled.p`
  font-weight: bold;
  font-size: 18px;
  color: #333; /* Màu chữ */
  margin-left: 10px; /* Khoảng cách giữa biểu tượng và tiêu đề */
  text-align: left; /* Căn trái nội dung */
`;

const TitleMain = styled(Title)`
  font-weight: bold;
  font-size: 21px;
`;

const MenuItemStyled = styled(MenuItem)`
  &:hover {
    background-color: #E3FDFD; /* Hiệu ứng hover cho menu item */
  }
`;

export default TrangCaNhanG;