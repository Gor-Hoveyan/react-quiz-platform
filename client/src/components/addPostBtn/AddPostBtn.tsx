import React from 'react';
import styles from './AddPostBtn.module.scss';
import { NavLink } from 'react-router-dom';
import { FiPlusCircle } from 'react-icons/fi';

interface IProps {
    postType: 'test' | 'quiz'
}

export default function AddPostBtn({postType}: IProps) {
    return (
        <div className={styles.addPost}>
                <NavLink to={`/${postType}/create`}><FiPlusCircle size={70} cursor={'pointer'} color='gray'
                    onMouseMove={(target) => target.currentTarget.style.color = 'black'}
                    onMouseOut={(target) => target.currentTarget.style.color = 'gray'}
                    style={{ transitionDuration: '0.4s' }} />
                </NavLink>
            </div>
    );
}