import React from 'react';
import styles from './Tests.module.scss';
import { TestData } from '../../stores/homeStore';
import { NavLink } from 'react-router-dom';
import useUserStore from '../../stores/userStore';
import { Test } from '../../stores/testStore';
import { BiSolidComment } from 'react-icons/bi'

interface IProps {
    tests: TestData[] | Test[]
}

export default function Tests({ tests }: IProps) {
    const username = useUserStore(state => state.user?.username);
    const like = useUserStore(state => state.like);

    function getUsername(test: Test | TestData) {
        if ((test as TestData).authorsName !== undefined) {
            return (test as TestData).authorsName
        } else {
            return username;
        }
    }
    let handleLike = (e: React.MouseEvent<HTMLParagraphElement>, testId: string) => {
        e.preventDefault();
        if (testId) {
            like(testId);
            handleLike = () => { } //Replace handleLike with empty function to remove event
        }
    }
    return (
        <div>
        <ul className={styles.testList}>
            {tests.map(test => (
                <NavLink key={test._id} className={styles.navLink} to={`/test/review/${test._id}`}>
                    <li className={styles.testItem}>
                        <div className={styles.titleDateDiv}>
                            <h2 className={styles.testTitle}>{test.name}</h2>
                            <p className={styles.testDate}>{test.createdAt.split('T')[0]}</p>
                        </div>
                        <p className={styles.testAuthor}>{getUsername(test)}</p>
                        <p className={styles.testDescription}>{test.description}</p>
                        <div className={styles.testOtherData}>
                            <p className={styles.testLikes}>
                                <span onClick={(e: React.MouseEvent<HTMLParagraphElement>) => handleLike(e, test._id)} style={{ color: 'red' }}>&#10084;</span>
                                {test.likes}
                            </p>
                            <p className={styles.testComments}>
                                <BiSolidComment color='#2065ce' className={styles.testCommentIcon} />
                                {test.comments.length + test.commentAnswers?.length}
                            </p>
                        </div>
                    </li>
                </NavLink>
            ))}
        </ul>
        </div>
    );
}