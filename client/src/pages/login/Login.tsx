import React from 'react';
import styles from './Login.module.scss';
import useUserStore from '../../stores/userStore';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

type FormValues = {
    email: string,
    password: string,
}

const Login = () => {
    const login = useUserStore(state => state.login);
    const setError = useUserStore(state => state.setError);
    const errorText = useUserStore(state => state.errText);
    const isLogged = useUserStore(state => state.isLogged)

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        mode: 'onBlur'
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        if (!data.email.includes('@')) {
            setError('Entered invalid password or email');
        } else if (data.email.split('@')[1].length < 5 || !data.email.split('@')[1].includes('.') || data.password.length < 8) {
            setError('Entered invalid password or email');
        } else if (errors.email?.message || errors.password?.message) {
            setError('Entered invalid password or email');
        } else {
            login(data.email, data.password);
        }

    }

    return (<>
        {!isLogged ? <div className={styles.main}>
            <div className={styles.formContainer}>
                <h2 className={styles.header}>Login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.inputField}>
                        <label className={styles.label} htmlFor='email'>Email</label>
                        <input {...register('email', { required: 'This field is required' })}
                            className={styles.input} id='email' name='email' required />
                        {errors.email?.message && <p className={styles.error}>{errors.email?.message}</p>}
                    </div>
                    <div className={styles.inputField}>
                        <label className={styles.label} htmlFor='password'>Password</label>
                        <input {...register('password', { required: 'This field is required' })}
                            className={styles.input} type='password' id='password' name='password' required />
                        {errors.password?.message && <p className={styles.error}>{errors.password?.message}</p>}
                    </div>
                    {errorText ? <p className={styles.error}>{errorText}</p> : ''}
                    <button className={styles.button} type='submit'>Login</button>
                </form>
            </div>
        </div> : <Navigate to={'/'} />
        }</>
    );
};


export default Login;