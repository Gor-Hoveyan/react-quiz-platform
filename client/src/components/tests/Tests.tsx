import React from 'react';
import styles from './Tests.module.scss';
import Loader from '../loader/Loader';
import { Test } from '../../stores/testStore';
import TestComponent from '../testComponent/TestComponent';

interface IProps {
    tests: Test[]
}

export default function Tests({ tests }: IProps) {

    return (
        <div>
            <ul className={styles.testList}>
                {tests[0]?._id ? tests.map((test, index) => (
                    <TestComponent key={index} test={test} />
                )) : <Loader />}
            </ul>
        </div>
    );
}