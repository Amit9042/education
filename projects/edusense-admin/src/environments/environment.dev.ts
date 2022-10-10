export const environment = {
    envType: 'dev',
    apiUrl: 'https://edusense-dev-api.smartsenselabs.com',
    pubnubSubKey: 'sub-c-bed92252-94e0-11ea-8dc6-429c98eb9bb1',
    connOpts: {
        hosts: {
            domain: 'telemeet-demo.smartsenselabs.com',
            focus: 'focus.telemeet-demo.smartsenselabs.com',
            muc: 'conference.telemeet-demo.smartsenselabs.com'
        },
        bosh: 'https://telemeet-demo.smartsenselabs.com/http-bind',
        enableNoAudioDetection: true,
        enableNoisyMicDetection: true
    }
};
