import React from 'react';
import styles from './UserIcon.module.scss';
import { NavLink } from 'react-router-dom';

interface IProps {
    username: string,
    id: string,
    avatarUrl: string,
    createdAt?: string
}

export default function UserIcon({ username, id, avatarUrl, createdAt }: IProps) {
    return (
        <div className={styles.titleDateDiv}>
            <div className={styles.userIcon}>
                <NavLink to={`/profile/${id}`} className={styles.username} >
                    <img
                        className={styles.avatar}
                        src={avatarUrl?.trim() ? avatarUrl : 'https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'}
                        alt={`${username}'s avatar`}
                    />
                    {username}
                </NavLink>
            </div>
            <div>
                {createdAt && <p className={styles.testDate}>{createdAt.split('T')[0]}</p>}
            </div>
        </div>
    )
}

/*                    
                        <UserIcon username={test.author.username} id={test.author._id} avatarUrl={test.author.avatarUrl} />
                        
                     */