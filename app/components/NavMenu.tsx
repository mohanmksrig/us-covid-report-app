// Import required dependencies
import React from 'react';
import { Button } from 'antd';
import Link from 'next/link';
import { MenuOutlined } from '@ant-design/icons';
import styles from '../CovidForm.module.css';

// Interface for NavMenu props
interface NavMenuProps {
  currentPage: 'dashboard' | 'form';
}

/* Navigation Menu Component Start */
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
/* Navigation Menu Component End */
export default NavMenu;

/* NavMenu Script End */