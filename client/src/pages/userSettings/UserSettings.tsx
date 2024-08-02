import React from "react";
import styles from './UserSettings.module.scss';
import useUserStore from "../../stores/userStore";
import { Navigate, NavLink } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
    username: string,
    email: string,
    bio: string,
    showLikedPosts: boolean,
    showPassedTests: boolean
}

export default function UserSettings() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        mode: 'onBlur',
    });
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);
    const isUpdated = useUserStore(state => state.isUpdated);
    const handleIsUpdated = useUserStore(state => state.handleIsUpdated);

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        updateUser(data.username, data.bio, data.showLikedPosts, data.showPassedTests);
        handleIsUpdated(true);
    }


    return (user?._id ?
        <div className={styles.userSettings}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

                <h3 className={styles.headers}>Username</h3>
                <input className={styles.textInput} type='text'
                    {...register('username', {
                        minLength: { value: 3, message: 'Username must contain at least 3 characters' },
                        maxLength: { value: 24, message: 'Username can contain maximum 24 characters' },
                        required: 'This field can\'t be empty'
                    })}
                    defaultValue={user.username ? user.username : ''} placeholder='Username'
                />
                <p className={styles.error}>{errors.username?.message}</p>

                <h3 className={styles.headers}>Email</h3>
                <input className={styles.textInput} type='text'
                    {...register('email')}
                    defaultValue={user.email ? user.email : ''} placeholder='Email' disabled
                />
                <p className={styles.error}>{errors.email?.message}</p>

                <h3 className={styles.headers}>Bio</h3>
                <input className={styles.textInput} type='text'
                    {...register('bio', {
                        maxLength: { value: 75, message: 'Bio can contain maximum 75 characters' },
                    })} defaultValue={user.bio.trim() ? user.bio : ''} placeholder='Bio'
                />
                <p className={styles.error}>{errors.bio?.message}</p>

                <div className={styles.detailsDIv}>
                    <div className={styles.checkboxContainer}>
                        <input className={styles.checkbox} id='showLikedPosts'
                            type='checkbox' {...register('showLikedPosts')} defaultChecked={user.showLikedPosts}
                        />
                        <label htmlFor='showLikedPosts' >
                            Show liked posts
                        </label>
                    </div>
                    <div className={styles.checkboxContainer}>
                        <input className={styles.checkbox} id='showPassedTests'
                            type='checkbox' {...register('showPassedTests')} defaultChecked={user.showPassedPosts}
                        />
                        <label htmlFor='showLikedPosts' >
                            Show passed tests
                        </label>
                    </div>
                </div>
                <br />
                {isUpdated ?

                    <NavLink className={styles.navLink} to={'/profile'} reloadDocument>
                        Return to home
                    </NavLink>

                    : <button className={styles.button} type='submit'>Save changes</button>}
            </form>
        </div> : <Navigate to={`/login`} />
    )
}