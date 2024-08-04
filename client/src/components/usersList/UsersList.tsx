import React from 'react';
import styles from './UsersList.module.scss';
import UserIcon from '../userIcon/UserIcon';
import { IUserIcon } from '../../stores/userStore';

interface IProps {
    icons: Omit<IUserIcon, 'createdAt'>[],
    isFollowers: boolean,
}

export default function UsersList({ icons, isFollowers }: IProps) {
    return (
    <div className={styles.usersList}>
        <h3 className={styles.usersListHeader}>
            {isFollowers ? 'Followers' : 'Followings'}
        </h3>
        {icons.length ? icons.map((icon, index) => {
            return <UserIcon key={index} username={icon.username} avatarUrl={icon.avatarUrl} id={icon._id} />
        }) : <h3 className={styles.usersListHeader}>
            {isFollowers ? '0 followers' : '0 Followings'}
            </h3>}
    </div>
    );
}