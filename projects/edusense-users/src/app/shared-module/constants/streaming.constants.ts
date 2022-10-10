import { environment } from '../../../environments/environment';

export enum MediaTracksEnum {
    AUDIO = 'audio',
    VIDEO = 'video',
    DESKTOP = 'desktop'
}

export const initOpts = {
    useIPv6: true,
    desktopSharingChromeDisabled: false,
    // desktopSharingChromeSources: ['tab'],
    desktopSharingChromeMinExtVersion: '0.1',
    disableSimulcast: false,
    enableAnalyticsLogging: false
};

export const connOpts = environment.connOpts;

export const localConfigs = {
    devices: [MediaTracksEnum.AUDIO, MediaTracksEnum.VIDEO],
    resolution: 1280,
    minFps: 30,
    maxFps: 60
};

export enum BroswersEnum {
    FireFox = 'fireFox',
    SamsungBrowser = 'samsungbrowser',
    CHROME = 'chrome',
    SAFARI = 'safari',
    EDGE = 'edge',
    OPERA = 'opera',
    IE = 'trident'
}

export const BrowserConstraintConf = {
    [BroswersEnum.CHROME]: {
        video: {
            aspectRatio: 16 / 9,
            height: { ideal: 720, max: 720, min: 460 },
            width: { ideal: 1280, max: 1280, min: 800 }
        }
    },
    [BroswersEnum.FireFox]: {
        audio: {
            deviceId: 'default',
            autoGainControl: true,
            echoCancellation: true,
            noiseSuppression: true
        },
        video: {
            aspectRatio: 16 / 9,
            height: { min: 400, ideal: 1080 },
            width: { min: 640, ideal: 1920, max: 1920 }
        }
    },
    [BroswersEnum.SAFARI]: {
        // video: {aspectRatio: 16 / 9, height: {ideal: 720, max: 720, min: 480}, width: {ideal: 1280, max: 1280, min: 640}},
        // audio: {deviceId: "default", autoGainControl: true, echoCancellation: true, noiseSuppression: true}
    }
};

export const confOpts = {
    openBridgeChannel: true,
    recordingType: 'recording-service'
};

export enum AudioDeviceType {
    OUTPUT = 'audiooutput',
    INPUT = 'audioinput'
}

export enum ConnectionType {
    Poor = 'poor',
    NonOptimal = 'nonoptimal',
    Good = 'good'
}

export enum SessionEvents {
    TRACK_ADDED = 'TRACK_ADDED',
    LOCAL_TRACK_CHANGED = 'LOCAL_TRACK_CHANGED',
    LOCAL_TRACK_STOPPED = 'LOCAL_TRACK_STOPPED',
    TRACK_REMOVED = 'TRACK_REMOVED',
    CONFERENCE_JOINED = 'CONFERENCE_JOINED',
    KICKED = 'KICKED',
    CONFERENCE_LEFT = 'CONFERENCE_LEFT',
    USER_JOINED = 'USER_JOINED',
    USER_LEFT = 'USER_LEFT',
    TRACK_MUTE_CHANGED = 'TRACK_MUTE_CHANGED',
    DISPLAY_NAME_CHANGED = 'DISPLAY_NAME_CHANGED',
    MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
    PRIVATE_MESSAGE_RECEIVED = 'PRIVATE_MESSAGE_RECEIVED',
    LOCAL_STATS_UPDATED = 'LOCAL_STATS_UPDATED',
    REMOTE_STATS_UPDATED = 'REMOTE_STATS_UPDATED',
    CONNECTION_ESTABLISHED = 'CONNECTION_ESTABLISHED',
    CONNECTION_FAILED = 'CONNECTION_FAILED',
    CONNECTION_DISCONNECTED = 'CONNECTION_DISCONNECTED',
    CONFERENCE_CREATED_TIMESTAMP = 'CONFERENCE_CREATED_TIMESTAMP',
    USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',
    DOMINANT_SPEAKER_CHANGED = 'DOMINANT_SPEAKER_CHANGED'
}

export enum ClassJoinStat {
    None = 0,
    Waiting = 1,
    Active = 2,
    Left = 3
}

export enum WebRTCUserRole {
    None = 'none',
    Moderator = 'moderator',
    Participant = 'participant',
    Local = 'local'
}

export const VIDEO_QUALITY_LEVELS = {
    HIGH: 1080,
    STANDARD: 360,
    LOW: 180
};

export const STREAMING_USER_TYPE = {
    LOCAL: 'local',
    REMOTE: 'remote'
};

export const WEB_RTC_ERROR_TYPE = {
    CONNECTION_PASSWORD_REQUIRED: 'CONNECTION_PASSWORD_REQUIRED',
    CONNECTION_DROPPED_ERROR: 'CONNECTION_DROPPED_ERROR'
};

export const WEB_RTC_CONNECTION_STAT = {
    NOT_CONNECTED: 'NOT_CONNECTED',
    CONNECTED: 'CONNECTED',
    CONNECTION_FAILURE: 'CONNECTION_FAILURE',
    NETWORK_FAILURE: 'NETWORK_FAILURE',
    DISCONNECTED: 'DISCONNECTED'
};

export const WEB_RTC_STATS = {
    JIBRI: 'jibri',
    DAMIEN: 'damien-4gu'
};

export const RECORDING_MODE = {
    FILE: 'file'
};
