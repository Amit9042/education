import {
    AudioDeviceType,
    BrowserConstraintConf,
    confOpts,
    connOpts,
    initOpts,
    localConfigs,
    MediaTracksEnum,
    SessionEvents,
    WEB_RTC_ERROR_TYPE,
    BroswersEnum,
    RECORDING_MODE
} from '@sharedModule/constants';
import { Observable, merge, fromEvent, Observer } from 'rxjs';
import { getBrowserName } from '@sharedModule/functions';
import { map } from 'rxjs/operators';

declare var JitsiMeetJS: any;

export class StreamingService {
    timerInterval = null;
    constructor() {
        this.initJitsi();
    }

    initJitsi() {
        JitsiMeetJS.init(initOpts);
        JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
    }

    getAudioDevices(): Observable<any> {
        return new Observable((resolve) => {
            JitsiMeetJS.mediaDevices.enumerateDevices((devices: any) => {
                resolve.next(this.filterDevices(devices));
            });
        });
    }

    audioDeviceChange(): Observable<any> {
        return new Observable((resolve) => {
            JitsiMeetJS.mediaDevices.addEventListener(
                JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
                (devices: any) => {
                    resolve.next(this.filterDevices(devices));
                }
            );
        });
    }

    filterDevices(devices: any) {
        const opDevices = [];
        const ipDevices = [];
        for (const device of devices) {
            if (device.kind === AudioDeviceType.OUTPUT) {
                opDevices.push(device);
            }
            if (device.kind === AudioDeviceType.INPUT) {
                ipDevices.push(device);
            }
        }
        return { opDevices, ipDevices };
    }

    connect(token: string): Observable<any> {
        return new Observable((resolve) => {
            const connection = new JitsiMeetJS.JitsiConnection(
                null,
                token,
                connOpts
            );
            connection.addEventListener(
                JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
                (resp: any) => {
                    resolve.next({
                        event: SessionEvents.CONNECTION_ESTABLISHED,
                        data: { id: resp, connection }
                    });
                }
            );
            connection.addEventListener(
                JitsiMeetJS.events.connection.CONNECTION_FAILED,
                (resp: any) => {
                    let err: string;
                    switch (resp) {
                        case JitsiMeetJS.errors.connection.PASSWORD_REQUIRED:
                            err =
                                WEB_RTC_ERROR_TYPE.CONNECTION_PASSWORD_REQUIRED;
                            break;
                        case JitsiMeetJS.errors.connection
                            .CONNECTION_DROPPED_ERROR:
                            err = WEB_RTC_ERROR_TYPE.CONNECTION_DROPPED_ERROR;
                            break;
                        default:
                            err = resp;
                            break;
                    }
                    resolve.next({
                        event: SessionEvents.CONNECTION_FAILED,
                        data: { err }
                    });
                }
            );
            connection.addEventListener(
                JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
                (err: any) => {
                    resolve.next({
                        event: SessionEvents.CONNECTION_DISCONNECTED,
                        data: { err }
                    });
                }
            );
            connection.connect();
        });
    }

    getMyUserId(room) {
        return room && room.myUserId();
    }

    async addLocalTracks(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const browserName = getBrowserName();
                if (browserName !== BroswersEnum.CHROME) {
                    localConfigs['constraints'] =
                        BrowserConstraintConf[getBrowserName()];
                }
                const localTracks = await JitsiMeetJS.createLocalTracks(
                    localConfigs
                );
                resolve(localTracks);
            } catch (err) {
                reject(err);
            }
        });
    }

    startNewSession(
        connection: any,
        roomName: string,
        userName: string
    ): Observable<any> {
        // user._conference.options.config.userInfo
        return new Observable((resolve) => {
            roomName = roomName.toLowerCase();
            const room = connection.initJitsiConference(roomName, confOpts);
            room.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, (id) => {
                resolve.next({
                    event: SessionEvents.CONFERENCE_JOINED,
                    data: { room, id }
                });
            });
            room.on(JitsiMeetJS.events.conference.CONFERENCE_FAILED, (err) => {
                resolve.error(err);
            });
            room.on(JitsiMeetJS.events.conference.TRACK_ADDED, (track: any) => {
                resolve.next({
                    event: SessionEvents.TRACK_ADDED,
                    data: { track }
                });
            });
            room.on(
                JitsiMeetJS.events.conference.DOMINANT_SPEAKER_CHANGED,
                (id: string) => {
                    resolve.next({
                        event: SessionEvents.DOMINANT_SPEAKER_CHANGED,
                        data: { id }
                    });
                }
            );
            room.on(
                JitsiMeetJS.events.conference.USER_JOINED,
                (id: string, user: any) => {
                    resolve.next({
                        event: SessionEvents.USER_JOINED,
                        data: { id, user }
                    });
                }
            );
            room.on(
                JitsiMeetJS.events.conference.USER_LEFT,
                (id: string, user: any) => {
                    resolve.next({
                        event: SessionEvents.USER_LEFT,
                        data: { id, user }
                    });
                }
            );
            room.on(
                JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
                (id: string, displayName: string) => {
                    resolve.next({
                        event: SessionEvents.DISPLAY_NAME_CHANGED,
                        data: { id, displayName }
                    });
                }
            );
            room.on(
                JitsiMeetJS.events.conference.USER_ROLE_CHANGED,
                (id: string, role: string) => {
                    resolve.next({
                        event: SessionEvents.USER_ROLE_CHANGED,
                        data: { id, role }
                    });
                }
            );
            room.on(
                JitsiMeetJS.events.conference.MESSAGE_RECEIVED,
                (id: string, msg: string) => {
                    resolve.next({
                        event: SessionEvents.MESSAGE_RECEIVED,
                        data: { id, msg, isPrivate: false }
                    });
                }
            );
            room.on(
                JitsiMeetJS.events.conference.PRIVATE_MESSAGE_RECEIVED,
                (id: string, msg: string) => {
                    resolve.next({
                        event: SessionEvents.PRIVATE_MESSAGE_RECEIVED,
                        data: { id, msg, isPrivate: false }
                    });
                }
            );
            room.on(
                JitsiMeetJS.events.connectionQuality.LOCAL_STATS_UPDATED,
                (stats) => {
                    resolve.next({
                        event: SessionEvents.LOCAL_STATS_UPDATED,
                        data: { stats }
                    });
                }
            );
            room.on(
                JitsiMeetJS.events.connectionQuality.REMOTE_STATS_UPDATED,
                (id: string, stats) => {
                    resolve.next({
                        event: SessionEvents.REMOTE_STATS_UPDATED,
                        data: { id, stats }
                    });
                }
            );
            room.on(
                JitsiMeetJS.events.conference.CONFERENCE_CREATED_TIMESTAMP,
                (timestamp: number) => {
                    resolve.next({
                        event: SessionEvents.CONFERENCE_CREATED_TIMESTAMP,
                        data: { timestamp }
                    });
                }
            );
            this.setDisplayName(room, userName);
            room.join();
        });
    }

    addTrackToRoom(room, track) {
        room.addTrack(track);
    }

    async removeTrackFromRoom(room, track) {
        await room.removeTrack(track);
    }

    atttachTrack(track, element) {
        track.attach(element);
    }

    detachTrack(track, element) {
        track.detach(element);
    }

    async disposeTrack(track) {
        await track.dispose();
    }

    getParticipantById(room, id) {
        return room.getParticipantById(id);
    }

    subcRemoteEvents(remoteTrack: any): Observable<any> {
        return new Observable((resolve) => {
            remoteTrack.addEventListener(
                JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
                (track: any) => {
                    resolve.next({
                        event: SessionEvents.TRACK_MUTE_CHANGED,
                        data: { track }
                    });
                }
            );
        });
    }

    removeRemoteTrackListener(remoteTrack: any): Observable<any> {
        return new Observable((resolve) => {
            remoteTrack.removeEventListener(
                JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
                () => {}
            );
        });
    }

    disconnect(connection) {
        if (connection) {
            connection.removeEventListener(
                JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
                () => {}
            );
            connection.removeEventListener(
                JitsiMeetJS.events.connection.CONNECTION_FAILED,
                () => {}
            );
            connection.removeEventListener(
                JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
                () => {}
            );
            connection.disconnect();
        }
    }

    unlinkTracks(room: any, users: any, localTracks: any) {
        // tslint:disable-next-line: forin
        for (const trackType in localTracks) {
            room.removeTrack(localTracks[trackType]);
            localTracks[trackType].dispose();
        }

        // tslint:disable-next-line: forin
        for (const userId in users) {
            const participantTracks = users[userId].tracks;
            this.removeTracks(userId, participantTracks);
        }
    }

    leave(room: any) {
        room.leave();
    }

    removeTracks(id: string, tracks: any) {
        if (tracks && tracks.length) {
            for (const track of tracks) {
                if (track) {
                    const elementId = `${id}_${track.getType()}`;
                    const trackElement = document.getElementById(elementId);
                    track.detach(trackElement);
                    this.removeRemoteTrackListener(track);
                }
            }
            const divElement = document.getElementById(`${id}_div`);
            if (divElement) {
              divElement.remove();
            }
        }
    }

    onMute(track: any) {
        if (track.isMuted()) {
            track.unmute();
        } else {
            track.mute();
        }
    }

    setMutedPolicy(room: any) {
        room.setStartMutedPolicy({ audio: true, video: true });
    }

    // To send message in the group
    sendGroupMsg(room: any, msg: string) {
        room.sendTextMessage(msg);
    }

    sendPrivateMessage(room: any, id: string, msg: string) {
        room.sendPrivateTextMessage(id, msg);
    }

    getAudioOutputDevice(): string {
        return JitsiMeetJS.mediaDevices.getAudioOutputDevice();
    }

    setDisplayName(room, name) {
        room.setDisplayName(name);
    }

    electParticipant(room, id) {
        try {
            room.selectParticipant(id);
            room.pinParticipant(id);
        } catch (e) {
            console.error(e);
        }
    }

    createDesktopTrack(): Observable<any> {
        return new Observable((resolve) => {
            JitsiMeetJS.createLocalTracks({
                devices: [MediaTracksEnum.DESKTOP]
            })
                .then(async (tracks: any) => {
                    const track = tracks[0];
                    track.addEventListener(
                        JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
                        () => {
                            track.removeEventListener(
                                JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
                                () => {}
                            );
                            resolve.next({
                                event: SessionEvents.LOCAL_TRACK_STOPPED
                            });
                        }
                    );
                    resolve.next({
                        event: SessionEvents.LOCAL_TRACK_CHANGED,
                        data: { track }
                    });
                })
                .catch((error: any) => {
                    console.error(error);
                });
        });
    }

    startTimer(ts: number): Observable<string> {
        return new Observable((resolve) => {
            let timerDuration = '--:--:--';
            const currentTimeStamp = new Date().getTime();
            let timestamp = Math.floor((currentTimeStamp - ts) / 1000);
            this.timerInterval = setInterval(() => {
                ++timestamp;
                const hours = Math.floor(timestamp / 60 / 60);
                const fmHr = this.pad(hours);
                const minutes = this.pad(
                    Math.floor(timestamp / 60) - hours * 60
                );
                const seconds = this.pad(timestamp % 60);
                timerDuration = fmHr + ':' + minutes + ':' + seconds;
                resolve.next(timerDuration);
            }, 1000);
        });
    }

    stopTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }

    pad(val: any) {
        const valString = val + '';
        if (valString.length < 2) {
            return '0' + valString;
        } else {
            return valString;
        }
    }

    createOnline$() {
        return merge<boolean>(
            fromEvent(window, 'offline').pipe(map(() => false)),
            fromEvent(window, 'online').pipe(map(() => true)),
            new Observable((sub: Observer<boolean>) => {
                sub.next(navigator.onLine);
                sub.complete();
            })
        );
    }

    // Recording functions
    async startRecording(conference: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const appData = JSON.stringify({
                    file_recording_metadata: {
                        share: true
                    }
                });
                const result = await conference.startRecording({
                    mode: RECORDING_MODE.FILE,
                    appData
                });
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    stopRecording(conference: any, sessionId: string) {
        conference.stopRecording(sessionId);
    }
}
