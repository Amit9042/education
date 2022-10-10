// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    envType: 'local',
    apiUrl: 'https://edusense-dev-api.smartsenselabs.com',
    pubnubStudentSubKey: 'sub-c-bed92252-94e0-11ea-8dc6-429c98eb9bb1',
    pubnubProviderSubKey: 'sub-c-c1e180c4-b052-11ea-a40b-6ab2c237bf6e',
    connOpts: {
        hosts: {
            domain: 'telemeet-demo.smartsenselabs.com',
            focus: 'focus.telemeet-demo.smartsenselabs.com',
            muc: 'conference.telemeet-demo.smartsenselabs.com'
        },
        bosh: 'https://telemeet-demo.smartsenselabs.com/http-bind',
        enableNoAudioDetection: true,
        enableNoisyMicDetection: true,
        fileRecordingsEnabled: true,
        hiddenDomain: 'recorder.telemeet-demo.smartsenselabs.com'
    },
    mixpanelToken: '38324cee3000f7e0a9944a0c557d6ea5'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
