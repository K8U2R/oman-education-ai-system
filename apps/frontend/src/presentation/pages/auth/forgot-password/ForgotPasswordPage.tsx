import React from 'react'
import { Card } from '../../../components/common'
import { ForgotPasswordForm } from '../../../components/auth/ForgotPasswordForm'

import styles from '../AuthLayout.module.scss'

const ForgotPasswordPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                <ForgotPasswordForm />
            </Card>
        </div>
    )
}

export default ForgotPasswordPage
