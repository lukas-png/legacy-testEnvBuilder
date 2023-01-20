
cat >/var/www/html/env.js <<EOF
import { env } from './interface/envinterface';
//overrided by startup.sh
export const envVariables: env = {
     sparkyurl: 'http://sparky-service:$SPARKY_PORT',
    backendurl: 'http://stu-mgmt-backend:$BACKEND_PORT',
    submissionurl: 'http://exercise-submitter-server:$SUBMISSION_SERVER_PORT',
    courseid: '$SUBMISSION_WEB_CLIENT_COURSEID'
};
EOF

echo "Running $@"
exec "$@"