import React from "react";
import styles from './UserProfilePosts.module.scss';
import { Test } from "../../stores/testStore";
import Tests from "../tests/Tests";
import { FiPlusCircle } from "react-icons/fi";

import { NavLink } from "react-router-dom";
import Loader from "../loader/Loader";

interface IProps {
    tests: Test[],
    isLikedPosts?: boolean,
    isSavedPosts?: boolean,
}

export default function UserProfilePosts({ tests, isLikedPosts, isSavedPosts }: IProps) {
    return (
        <>
            <div className={styles.posts} >
                <h3 className={styles.postsHeader}>
                    {isLikedPosts && 'Liked posts'}
                    {isSavedPosts && 'Saved posts'}
                    {!isLikedPosts && !isSavedPosts && 'Your Posts'}
                </h3>
                {tests.length ? `${!tests[0]._id ? <Loader /> : <Tests tests={tests} />}` : <h4>No posts yet</h4>}
            </div>
            {!isLikedPosts && !isSavedPosts && <div className={styles.addPost}>
                <NavLink to='/test/create'><FiPlusCircle size={70} cursor={'pointer'} color='gray'
                    onMouseMove={(target) => target.currentTarget.style.color = 'black'}
                    onMouseOut={(target) => target.currentTarget.style.color = 'gray'}
                    style={{ transitionDuration: '0.4s' }} />
                </NavLink>
            </div>
            }
        </>
    );
}