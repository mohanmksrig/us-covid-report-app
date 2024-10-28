import React from 'react';
import { Menu, Button } from 'antd';
import Link from 'next/link';
import { MenuOutlined } from '@ant-design/icons';
import styles from '../CovidForm.module.css';

interface NavMenuProps {
  currentPage: 'dashboard' | 'form';
}

const NavMenu: React.FC<NavMenuProps> = ({ currentPage }) => {
  return (
    <div className={styles.navMenu}>
      <Button type="text" icon={<MenuOutlined />}>
        <Link href={currentPage === 'dashboard' ? '/covid-form' : '/'}>
          {currentPage === 'dashboard' ? 'Go to Form' : 'Go to Dashboard'}
        </Link>
      </Button>
    </div>
  );
};

export default NavMenu;