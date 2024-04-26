import { logger } from "~/logger.server";
import { ApiService, AuthTypes } from "../api.server";
import configServer from "../config.server";
import transformToSnakeCase from "../utils/transform.server";

type SessionRequest = {
    configurationId: string;
    ttl:number
}

type SessionResponse = {
    session_id: string;
}

const API_ENDPOINT = `${configServer.API_ENDPOINT}/scheduling/sessions`


const createSchedulerSession = async (sessionPayload: SessionRequest) => {
    const body = transformToSnakeCase(sessionPayload) as BodyInit

    try {
        const {data} = await ApiService.create<SessionResponse>({
            url: API_ENDPOINT,
            config: {
                body:JSON.stringify(body),
                headers: {
                    "Content-Type":"application/json"
                }
            },
            authType:AuthTypes.API_KEY
        })
        
        return data.session_id
    } catch (error) {
        logger.error("Error creating sessions", error)
    }
    return null;
    
}

const deleteSession = async (sessionId:string) => {

    try {
       await ApiService.create({
            url: `API_ENDPOINT/${sessionId}`,
            config:{},
            authType:AuthTypes.API_KEY
        })
        
        return true
    } catch (error) {
        logger.error("Error deleting sessions",error)
    }

    return false;
    
}

export default {
    createSchedulerSession,
    deleteSession
}