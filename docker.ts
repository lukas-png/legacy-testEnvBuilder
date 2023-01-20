import SparkyAuthentifikation from "./services/SparkyAuthentifikation";
import "stumgmtbackend"
import { ChangeCourseRoleDtoRoleEnum, AssignmentUpdateDtoStateEnum } from "stumgmtbackend";
import Stumgmtbackend from "./services/Stumgmtbackend";

export default class Docker {

public static async createTestEnvironment(spark: SparkyAuthentifikation, backend: Stumgmtbackend): Promise<void> {
    let user = await this.createUser(spark);
    let courseid = await this.createCourse(backend, user.adam);
    await this.enableSubmissionServer(courseid, user.exerciseserver, ChangeCourseRoleDtoRoleEnum.LECTURER, "exercise-submission-server", "http://exercise-submitter-server:8080/notify");
    await this.enrollStudents([user.student1, user.student2], courseid, backend);
    let groupid = await this.createGroup(backend, courseid, [user.student1, user.student2], "JP001");
    let assignmentid = await this.createAssignments(backend, courseid);
    await this.changeAssignmentState(backend, courseid, assignmentid);

}

public static async createUser(spark: SparkyAuthentifikation): Promise<{adam: string, student1: string, student2: string, exerciseserver: string}> {
    let adam = await spark.createUser("adam","123456");
    let student1 = await spark.createUser("student1","123456");
    let student2 = await spark.createUser("student2","123456");
    let exerciseserver = await spark.createUser("exerciseserver","123456");
    return {adam, student1, student2, exerciseserver};
}

public static async createCourse(backend: Stumgmtbackend, adam: string): Promise<string> {
let courseid = await backend.createCourse("adam","java", "wise2021", "Programmierpraktikum Java");
return courseid;
}
public static async enableSubmissionServer(courseid: string, studentid: string,role: ChangeCourseRoleDtoRoleEnum,
     notificationname: string, notificationurl: string): Promise<void> {
        let backend = await this.getAuthentificated("adam");
        await backend.updateUserRole(courseid, studentid, role);
        await backend.createNotification(courseid,notificationname,notificationurl);
}

public static async getAuthentificated(username: string): Promise<Stumgmtbackend> {
    let api = new SparkyAuthentifikation();
    let response = await api.authenticate(username, "123456");
    if(response.status) {
        if(response.data != null) {
          let token = response.data.token;
          if(token != null && token.token != null)    {
            let accesstoken = token.token;
            return new Stumgmtbackend(accesstoken);
          }
        }
    }
    return Promise.reject("Could not authenticate");
}

public static async enrollStudents(studentsid: string[], courseid: string, backend: Stumgmtbackend){
    for(let studentid of studentsid) {
        await backend.enrollStudent(courseid, studentid);
    }

}

public static async createGroup(backend: Stumgmtbackend, courseid: string,studentids: string[], groupname: string): Promise<string> {
    let id = await backend.createGroup(courseid, groupname, studentids);
    return id;
}

public static async createAssignments(backend: Stumgmtbackend, courseid: string): Promise<string> {
    return await backend.createAssignment(courseid,"Homework01");
}

public static async changeAssignmentState(backend: Stumgmtbackend, courseid: string, assignmentid: string) {
    await backend.changeAssignmentState(courseid, assignmentid, AssignmentUpdateDtoStateEnum.INPROGRESS);
}
}