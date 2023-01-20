import * as Auth from "sparkyservice";
import { ErrorInterface } from "../interface/ErrorInterface";
import { CredentialsDto, AuthenticationInfoDto } from "sparkyservice";
import { envVariables } from "../env";
import * as Backend from "stumgmtbackend";





export default class SparkyAuthentifikation {
    
    private config: Auth.Configuration;


    constructor() {

        this.config = SparkyAuthentifikation.getConfig();

    }
    
    public async authenticate(username:string, password:string): Promise<ErrorInterface<AuthenticationInfoDto>> {
        let auth = new Auth.AuthControllerApi(this.config);
        let credentials: CredentialsDto = {
            username: username,
            password: password
        };
        
        let returnInterface: ErrorInterface<AuthenticationInfoDto> = {
            message: "",
            code: 0,
            status: false,
            data: null
        };

        try {
            let response = await auth.authenticate(credentials);
            returnInterface.data = response.data;
            returnInterface.status = true;
        } catch(e) {
            console.log(e); // 401 false username or password
            returnInterface.status = false;
        }

        return returnInterface;
    }

    private static getConfig(): Auth.Configuration {
        let authConfig = new Auth.Configuration();
        authConfig.basePath= envVariables.sparkyurl;
        return authConfig;
    }

    public async createUser(username:string, password:string): Promise<string> {
        let auth = new Auth.UserControllerApi(this.config);
        let localuser: Auth.UsernameDto= {
            username: username
        };
        try {
         let user = await (await auth.createLocalUser(localuser)).data;
         user.passwordDto = {
                oldPassword: "",
                newPassword: password,
            };
            
          auth.editUser(user);
          
          let testUser = new Auth.AuthControllerApi(this.config);
            let credentials: CredentialsDto = {
                username: username,
                password: password
            };
            let authinfo = await (await testUser.authenticate(credentials)).data;

            let stumgmtconfig = new Backend.Configuration();
            stumgmtconfig.basePath = envVariables.backendurl;
            stumgmtconfig.baseOptions= {  headers: { Authorization: "Bearer " + authinfo.token } };
            let backend = new Backend.AuthenticationApi(stumgmtconfig);
            return await (await backend.whoAmI()).data.id;


        } catch(e) {
            console.log(e);
        }
        return Promise.reject("Error");

    }

    
}