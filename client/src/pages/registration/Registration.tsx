import React from 'react';
import styles from './Registration.module.scss';
import useUserStore from '../../stores/userStore';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

type FormValues = {
    username: string,
    email: string,
    password: string,
    confirmPassword: string
}


const Registration = () => {
    const reg = useUserStore(state => state.register);
    const setError = useUserStore(state => state.setError);
    const errorText = useUserStore(state => state.errText);
    const isRegistered = useUserStore(state => state.isRegistered);
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        mode: 'onBlur'
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        if (data.password !== data.confirmPassword) {
            setError('Passwords not match');
        } else if (!data.email.split('@')[1] || data.email.split('@')[1].length < 5 || !data.email.split('@')[1].includes('.')) {
            setError('Enter a valid email');
        } else if (errors.email?.message || errors.confirmPassword?.message || errors.password?.message || errors.username?.message) {
            setError('This fields can\'t be empty');
        } else {
            reg(data.email, data.username, data.password);
            setError('')
        }
    }

    return (
        !isRegistered ? <div className={styles.main}>
            <div className={styles.formContainer}>
                <h2 className={styles.header}>Sign Up</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.inputField}>
                        <label className={styles.label} htmlFor='username'>Username</label>
                        <input {...register('username', {
                            minLength: { value: 3, message: 'Username must contain at least 3 characters' },
                            maxLength: { value: 24, message: 'Username can contain maximum 24 characters' }, required: 'This field is required'
                        })}
                            className={styles.input} type='text' id='username' name='username' />
                        {errors.username?.message && <p className={styles.error}>{errors.username?.message}</p>}
                    </div>
                    <div className={styles.inputField}>
                        <label className={styles.label} htmlFor='email'>Email</label>
                        <input {...register('email', {
                            minLength: { value: 5, message: 'Email must contain at least 5 characters' },
                            maxLength: { value: 64, message: 'Email can contain maximum 64 characters' }, required: 'This field is required'
                        })}
                            className={styles.input} id='email' name='email' />
                        {errors.email?.message && <p className={styles.error}>{errors.email?.message}</p>}
                    </div>
                    <div className={styles.inputField}>
                        <label className={styles.label} htmlFor='password'>Password</label>
                        <input {...register('password', {
                            minLength: { value: 8, message: 'Password must contain at least 8 characters' }
                            , maxLength: { value: 64, message: 'Password can contain maximum 64 characters' }, required: 'This field is required'
                        })}
                            className={styles.input} type='password' id='password' name='password' />
                        {errors.password?.message && <p className={styles.error}>{errors.password?.message}</p>}
                    </div>
                    <div className={styles.inputField}>
                        <label className={styles.label} htmlFor='confirmPassword'>Confirm Password</label>
                        <input {...register('confirmPassword',)}
                            className={styles.input} type='password' id='confirmPassword' name='confirmPassword' />
                        {errors.confirmPassword?.message && <p className={styles.error}>{errors.confirmPassword?.message}</p>}
                    </div>
                    {errorText ? <p className={styles.error}>{errorText}</p> : ''}
                    <button className={styles.button} type='submit'>Sign Up</button>
                </form>
            </div>
        </div> : <Navigate to={`/auth/login`} />
    );
};

export default Registration;