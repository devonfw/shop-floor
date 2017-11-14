import { Service } from './service';

// All data extracted from the API as reponse(s)

export const SERVICESLIST: Service[] = [
    { name: 'Jenkins', image: 'assets/images/jenkins.png', urlLink: 'Jenkins' },
    { name: 'Sonar', image: 'assets/images/sonar.png', urlLink: 'Sonar' },
    { name: 'Nexus', image: 'assets/images/nexus.png', urlLink: 'Nexus' },
    { name: 'GitHub', image: 'assets/images/github.png', urlLink: 'GitHub' },
    { name: 'Mattermost', image: 'assets/images/mattermost.png', urlLink: 'Docker Registry' }
];

export const MYSERVICES: Service[] = [
    { name: 'My Thai Star', image: '', urlLink: '' },
    { name: 'Mirabaud Advisory', image: '', urlLink: '' }
]
