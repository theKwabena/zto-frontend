import pinia from "../store/index.js";
import router from "../routes/index.js"
export function ReqisterPlugins(app){
    app.use(router)
    app.use(pinia)

}