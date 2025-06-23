import { Aside } from '../../ui/Aside/Aside'
import { Header } from '../../ui/Header/Header'
import { SprintView } from '../../ui/SprintView/SprintView'
import styles from './SprintScreen.module.css'

export const SprintScreen = () => {
  return (
    <div>
        <div className={styles.containerSprintScreen}>
            <Header />
            <div className={styles.containerAsideSprintView}>
                <Aside />
                <SprintView />
            </div>
        </div>
    </div>
  )
}
