// Utilities
import { createPinia } from 'pinia'
import piniaPluginPersistedState, {createPersistedState} from "pinia-plugin-persistedstate"


const pinia = createPinia();




pinia.use(createPersistedState({
    auto: true,
}))
export default pinia
