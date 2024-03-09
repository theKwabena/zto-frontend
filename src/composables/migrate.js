import axios from "axios";
import {ref} from "vue";
import {useAuthStore} from "../store/auth.store.js";

export const useSSE = () => {
    const migrate_data = ref('')
    const upload_data = ref('')

    function migrateStream(dt_id, et_id){
        let str = new EventSource(`http://localhost:8000/stream/?dt_id=${dt_id}&et_id=${et_id}`)
        str.addEventListener("new_message", event => {
            const data = JSON.parse(event.data.replace(/'/g, '"'))
            user_store.dt_status = data.dt_status
            user_store.et_status = data.et_status

        }, false)

        str.addEventListener("end_event", async event => {
            const data = JSON.parse(event.data.replace(/'/g, '"'))
            user_store.dt_status = data.dt_status
            user_store.et_status = data.et_status

            if(data.et_status === "SUCCESS"){
                //BEGIN UPLOAD
                await axios.post(`https://localhost:8443/api/v1/tasks/migrate`,  {username : auth_store.user}, {withCredentials: true, credentials:'include'})
                    .then((resp)=>{
                      user_store.up_id = resp.data
                      setupMigrationStream()
                    })
                    .catch((error)=>{

                    })
            }
            str.close()
        }, false)
    }

    function uploadStream(userId){
        let str = new EventSource(`https://localhost:8443/api/v1/tasks/sse?userId=${userId}`)
        str.addEventListener("new_data", event => {
            upload_data.value = event.data
            user_store.up_status = event.data
        }, false)

        str.addEventListener("end_stream", event => {
            upload_data.value = event.data
            str.close()
        }, false)
    }


    return {migrate_data, migrateStream, uploadStream, upload_data}
}

export const setupMigrationStream = (userId) => {
    console.log("Setting up stream")

}
