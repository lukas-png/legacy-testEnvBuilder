import * as Stumgmt from "stumgmtbackend";
import { AssignmentApi, AssignmentRegistrationApi, AssignmentUpdateDto, AuthenticationApi, CourseCreateDto, SubmissionConfigDto } from "stumgmtbackend";
import { envVariables } from "../env";



export default class Stumgmtbackend {

    private config: Stumgmt.Configuration;
 


    constructor(access_token: string) {

        this.config = new Stumgmt.Configuration();
        this.config.basePath = envVariables.backendurl;
        this.config.baseOptions= {  headers: { Authorization: "Bearer " + access_token } };

    }

    
    public async createCourse(lecturer: string, name: string,semester: string, title: string): Promise<string>{
        try {
            let api = new Stumgmt.CourseApi(this.config);
            let groupsettings: Stumgmt.GroupSettingsDto = {
                allowGroups: true,
                sizeMin: 0,
                sizeMax: 10,
                selfmanaged: true,
                autoJoinGroupOnCourseJoined: false,
                mergeGroupsOnAssignmentStarted: false
            }

            let config: Stumgmt.CourseConfigDto = {
                groupSettings: groupsettings,
            }
                    

            let lecturers = [lecturer]
            let course: CourseCreateDto = {
                id: name + "-" + semester,
                shortname: name,
                semester: semester,
                title: title,
                lecturers: lecturers,
                isClosed: false,
                config: config
            }
            return await (await api.createCourse(course)).data.id;
        } catch(e) {
            console.log(e);
        }
        return Promise.reject("Error");
       
    }

    public async enrollStudent(courseid: string, mgmtid: string){
        try {
            let api = new Stumgmt.CourseParticipantsApi(this.config);
            let password: Stumgmt.PasswordDto = {
                password: ""
            }

            await api.addUser(password, courseid, mgmtid);
        } catch(e) {
            console.log(e);
        }
    }

    public async createGroup(courseid: string, groupname: string, studentids: string[]): Promise<string>{
        try {
            let api = new Stumgmt.GroupApi(this.config);
            let group: Stumgmt.GroupDto = {
                name: groupname,
                id: ""
            }
            let groupdata = await (await api.createGroup(group, courseid)).data;
            for(let student of studentids){
                let password: Stumgmt.PasswordDto = {
                    password: ""
                }
                await api.addUserToGroup(password,courseid, groupdata.id, student);
            }
            return groupdata.id;
        } catch(e) {
            console.log(e);
        }
        return Promise.reject("Error");
    }

    public async createAssignment(courseid: string, assignmentname: string): Promise<string>{
        try {
            let api = new Stumgmt.AssignmentApi(this.config);
            let assignment: Stumgmt.AssignmentDto = {
                id: "",
                name: assignmentname,
                state: Stumgmt.AssignmentDtoStateEnum.INREVIEW,
                type: Stumgmt.AssignmentDtoTypeEnum.HOMEWORK,
                collaboration: Stumgmt.AssignmentDtoCollaborationEnum.GROUP,
                points: 10
            }
            return await (await api.createAssignment(assignment, courseid)).data.id;
        } catch(e) {
            console.log(e);
        }
        return Promise.reject("Error");
    }

    public async changeAssignmentState(courseid: string, assignmentid: string, state: Stumgmt.AssignmentUpdateDtoStateEnum){
        try {
            let api = new Stumgmt.AssignmentApi(this.config);
            let assignment: Stumgmt.AssignmentUpdateDto = {
                state: state
            }
            await api.updateAssignment(assignment, courseid, assignmentid);
        } catch(e) {
            console.log(e);
        }
    }

    public async updateUserRole(courseid: string, studentid: string, role: Stumgmt.ChangeCourseRoleDtoRoleEnum){
        try {
            let api = new Stumgmt.CourseParticipantsApi(this.config);
            let user: Stumgmt.ChangeCourseRoleDto = {
                role: role
            }
            await api.updateUserRole(user, courseid, studentid);

        } catch(e) {
            console.log(e);
        }
    }

    public async createNotification(courseid: string, notificationname: string, notificationurl: string){
        try {
            let notification = new Stumgmt.NotificationApi(this.config);
            let subscriber: Stumgmt.SubscriberDto = {
                name: notificationname,
                url: notificationurl,
                events: "ALL"
            }
            await notification.subscribe(subscriber, courseid, subscriber.name);
        } catch(e) {
            console.log(e);
        }
    }

    public async setAssignmentConfig(courseid: string, assignmentid: string, toolname: string, config: string) {
        try {
            let api = new Stumgmt.AssignmentApi(this.config);
            let assignment = await api.getAssignmentById(courseid, assignmentid);
            let configs = assignment.data.configs;
            let found = false;

            if(configs != undefined){
                for(let i = 0; i < configs.length; i++){
                    if(configs[i].tool == toolname){
                        configs[i].config = config;
                        found = true;
                        break;
                    }
                }
            } 
            if(!found){
                if(configs == undefined) {
                    configs = [];
                    configs.push({tool: toolname, config: config});
                } else if (configs != undefined){
                    configs.push({tool: toolname, config: config});
                }
            }
            let update: AssignmentUpdateDto = {
                configs: configs
            }
            
            await api.updateAssignment(update, courseid, assignmentid);
        } catch(e) {
            console.log(e);
        }
    }

        



  











}