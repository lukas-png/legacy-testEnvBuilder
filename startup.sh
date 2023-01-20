
cat >/var/www/html/env.js <<EOF
import { env } from './interface/envinterface';
//overrided by startup.sh
export const envVariables: env = {
    sparkyurl: '$SPARKY_BASEURL',
    backendurl: '$BACKEND_BASEUR',
    submissionurl: '$SUBMISSION_SERVER_PATH',
    courseid: '$SUBMISSION_WEB_CLIENT_COURSEID'
};
EOF

echo "Running $@"
exec "$@"