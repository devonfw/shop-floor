import { Service } from './service';

// All data extracted from the API as reponse(s)

export const SERVICESLIST: Service[] = [
    { name: 'Jenkins', image: 'jenkins.png', urlLink: 'Jenkins', status: '', },
    { name: 'Sonar', image: 'sonar.png', urlLink: 'Sonar', status: '', },
    { name: 'Nexus', image: 'nexus.png', urlLink: 'Nexus', status: '', },
    { name: 'GitHub', image: 'github.png', urlLink: 'GitHub', status: '', },
    { name: 'Mattermost', image: 'mattermost.png', urlLink: 'Docker Registry', status: '', }
];

export const MYSERVICES: Service[] = [
    { name: 'My Thai Star client', image: '', urlLink: '', status: '#f00' },
    { name: 'My Thai Star server', image: '', urlLink: '', status: '#ff0' }
];
