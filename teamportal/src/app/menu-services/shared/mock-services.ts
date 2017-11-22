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
    { name: 'My Thai Star', image: '', urlLink: '', status: '#0f0' },
    { name: 'Mirabaud Advisory', image: '', urlLink: '', status: '#0f0' },
    { name: 'TRSC', image: '', urlLink: '', status: '#ff0' },
    { name: 'Canon', image: '', urlLink: '', status: '#f00' },
    { name: 'My Thai Star', image: '', urlLink: '', status: '#0f0' },
    { name: 'Mirabaud Advisory', image: '', urlLink: '', status: '#f00' },
    { name: 'TRSC', image: '', urlLink: '', status: '#0f0' },
    { name: 'Canon', image: '', urlLink: '', status: '#0f0' }
];
