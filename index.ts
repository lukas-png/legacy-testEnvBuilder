import "stumgmtbackend";
import "sparkyservice";
import "exerciseserverclientlib";
import { envVariables } from "./env";
import SparkyAuthentifikation from "./services/SparkyAuthentifikation";
import Stumgmtbackend from "./services/Stumgmtbackend";
import Docker from "./docker";

wait(20000).then(() => {
    console.log("Starting test environment creation");
    let api = new SparkyAuthentifikation();
    api.authenticate("admin_user", "admin_pw").then((response) => {
        if(response.status) {
            if(response.data != null) {
            let token = response.data.token;
            if(token != null && token.token != null)    {
                let accesstoken = token.token;

                Docker.createTestEnvironment(api, new Stumgmtbackend(accesstoken)).then(() => {
                    console.log("Test environment created");
                } ).catch((e) => {
                    console.log(e);
                });


            }
            }
            }
        
        });
    });

    function wait(seconds: number) {
        return new Promise(vars => setTimeout(vars, seconds));
        
    }


