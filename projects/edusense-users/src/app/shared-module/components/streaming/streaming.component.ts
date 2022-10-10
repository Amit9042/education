import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {
  ConnectionType,
  MediaTracksEnum,
  SessionEvents,
  WebRTCUserRole,
  WEB_RTC_ERROR_TYPE,
  WEB_RTC_CONNECTION_STAT,
  WEB_RTC_STATS, UserTypeEnum
} from '@sharedModule/constants';
import { SharedService } from '@sharedModule/services';
import { StreamingService } from './streaming.service';
import { Classes } from '@sharedModule/models';
import { PubnubService } from '@sharedModule/pubnub';
import { RecordingService } from './recording.service';

enum Views {
    CHAT_VIEW = 1
}

interface FsDocument extends HTMLDocument {
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    msExitFullscreen?: () => void;
    mozCancelFullScreen?: () => void;
}

interface FsDocumentElement extends HTMLElement {
    msRequestFullscreen?: () => void;
    mozRequestFullScreen?: () => void;
}

@Component({
    selector: 'app-streaming',
    templateUrl: './streaming.component.html',
    styleUrls: ['./streaming.component.scss'],
    providers: [StreamingService]
})
export class StreamingComponent implements OnInit, OnDestroy {
    @Input() userDetails: any;
    @Input() channelName: string;
    @Input() meetingToken: string;
    @Input() isProvider: boolean;
    @Input() classDetails: Classes = null;
    @Output() endStreaming = new EventEmitter<boolean>();
    @Output() leavePage = new EventEmitter<boolean>();
    @Output() classJoin = new EventEmitter<boolean>();
    @Output() handRaise = new EventEmitter<boolean>();

    // Static variables
    htmlView = Views;
    connectionState = WEB_RTC_CONNECTION_STAT;
    currentConnectionState = WEB_RTC_CONNECTION_STAT.NOT_CONNECTED;
    activeView = null;
    headerElem = document.getElementById('navHeader');
    sidebarElem = document.getElementById('navSidebar');

    mediaTracksEnum = MediaTracksEnum;
    audioOutputDevices = [];
    audioInputDevices = [];
    messagesArray = [];
    msgBadgeCount = 0;

    users = {};
    providerUserId = null;
    localUser = {
        id: null,
        display_name: null,
        ph_char: null,
        tracks: {},
        connType: null,
        stats: null
    };
    centerViewDetail = { id: null, ph_char: null };
    remoteLeftUsers = {};
    recSession = null;

    connection = null;
    room = null;
    isVideo = true;
    isShowActions = false;
    timeCount = null;
    isFullScreen = false;
    isShowStudents = true;

    timerDuration = '--:--:--';
    object = Object;

    timerIntervalSub$: any;
    remoteEventSub$: any;
    startSessionSub$: any;
    switchDisplaySubs$: any;
    connectionSubs$: any;
    onlineSubs$: any;

    isGridView = false;
    isTotalStudentView = false;
    isRecordingOn = false;

    constructor(
        protected pubnubService: PubnubService,
        protected sharedService: SharedService,
        protected streamingService: StreamingService,
        protected recordingService: RecordingService
    ) {}

    ngOnInit(): void {
        this.setLocalUserDetails();
        this.subsOnlineSubs();
    }

    setLocalUserDetails() {
        const displayName = `${this.userDetails.first_name} ${this.userDetails.last_name}`;
        const placeChar = `${this.userDetails.first_name
            .charAt(0)
            .toUpperCase()}${this.userDetails.last_name
            .charAt(0)
            .toUpperCase()}`;
        this.localUser.display_name = displayName;
        this.localUser.ph_char = placeChar;
    }

    connectWebRTC() {
        this.meetingToken = this.meetingToken;
        this.connectionSubs$ = this.streamingService
            .connect(this.meetingToken)
            .subscribe((response) => {
                this.handleConnResp(response);
            });
    }

    handleConnResp(response: any) {
        const data = response.data;
        switch (response.event) {
            case SessionEvents.CONNECTION_ESTABLISHED:
                this.onConnEstablish(data.connection);
                break;
            case SessionEvents.CONNECTION_FAILED:
                this.onConnFailed(data.err);
                break;
            case SessionEvents.CONNECTION_DISCONNECTED:
                console.log('CONNECTION_DISCONNECTED');
                break;
            default:
                break;
        }
    }

    onConnEstablish(connection: any) {
        this.connection = connection;
        this.currentConnectionState = this.connectionState.CONNECTED;
        this.startNewConf(this.channelName);
    }

    onConnFailed(err: any) {
        switch (err) {
            case WEB_RTC_ERROR_TYPE.CONNECTION_PASSWORD_REQUIRED:
                this.currentConnectionState = this.connectionState.CONNECTION_FAILURE;
                break;
            case WEB_RTC_ERROR_TYPE.CONNECTION_DROPPED_ERROR:
                this.onNetworkFailed();
                break;
        }
    }

    onNetworkFailed() {
        this.currentConnectionState = this.connectionState.NETWORK_FAILURE;
        this.centerViewDetail = { id: null, ph_char: null };
        this.streamingService.unlinkTracks(
            this.room,
            this.users,
            this.localUser.tracks
        );
        if (this.connectionSubs$) {
            this.connectionSubs$.unsubscribe();
            this.connectionSubs$ = null;
        }
    }

    subsOnlineSubs() {
        this.onlineSubs$ = this.streamingService
            .createOnline$()
            .subscribe((isOnline) => {
                if (isOnline) {
                    this.connectWebRTC();
                    this.subscribePushChannels();
                } else {
                    this.onNetworkFailed();
                }
            });
    }

    subscribePushChannels() {
        this.pubnubService.unsubscribeChannels();
        const commonChannel = `${this.userDetails.user_id}__${this.userDetails['user_role_link.role_id']}__${this.userDetails.user_uuid}`;
        const channels = [commonChannel];
        if (this.userDetails.app_id === UserTypeEnum.STUDENT) {
          const privateChannel = `${commonChannel}__${this.sharedService.getActiveEnterprise().provider_uuid}`
          channels.push(privateChannel);
        }
        this.pubnubService.subscribeChannels(channels);
    }

    handleAudioDevices(devices: any) {
        this.audioOutputDevices = devices.opDevices;
        this.audioInputDevices = devices.ipDevices;
    }

    getSpeakerStats() {
        const stats = this.room.getSpeakerStats();
        console.log(stats);
    }

    async startNewConf(roomName: string) {
        try {
            const localTracks = await this.streamingService.addLocalTracks();
            this.onLocalTracks(localTracks);
            this.startSessionSub$ = this.streamingService
                .startNewSession(
                    this.connection,
                    roomName,
                    this.localUser.display_name
                )
                .subscribe(
                    (response) => {
                        this.handleSessResp(response);
                    },
                    (e) => {
                        console.error('Error while starting new session', e);
                    }
                );
        } catch (e) {
            console.error('Error while adding local tracks', e);
        }
    }

    handleSessResp(response: any) {
        const data = response.data;
        switch (response.event) {
            case SessionEvents.CONFERENCE_JOINED:
                this.onSessionStart(data);
                break;
            case SessionEvents.CONFERENCE_CREATED_TIMESTAMP:
                this.onConferenceTime(data.timestamp);
                break;
            case SessionEvents.TRACK_ADDED:
                this.onRemoteTrack(data.track);
                break;
            case SessionEvents.DOMINANT_SPEAKER_CHANGED:
                console.log(data);
                break;
            case SessionEvents.USER_JOINED:
                this.onUserJoin(data.id, data.user);
                break;
            case SessionEvents.USER_LEFT:
                this.onUserLeft(data.id, data.user);
                break;
            case SessionEvents.USER_ROLE_CHANGED:
                this.onRoleChanged(data.id, data.role);
                break;
            case SessionEvents.DISPLAY_NAME_CHANGED:
                this.onDisplayNameChanged(data.id, data.displayName);
                break;
            case SessionEvents.MESSAGE_RECEIVED:
                this.onMsgReceived(data, false);
                break;
            case SessionEvents.LOCAL_STATS_UPDATED:
                this.setConnType(data.stats);
                break;
            case SessionEvents.REMOTE_STATS_UPDATED:
                this.setConnType(data.stats, data.id);
                break;
            default:
                break;
        }
    }

    setConnType(stats, id?) {
        let connType = ConnectionType.Poor;
        if (stats.connectionQuality > 30 && stats.connectionQuality <= 100) {
            connType = ConnectionType.Good;
        } else if (
            stats.connectionQuality > 10 &&
            stats.connectionQuality <= 30
        ) {
            connType = ConnectionType.NonOptimal;
        }
        if (id && this.users[id]) {
            this.users[id].stats = stats;
            this.users[id].connType = connType;
        } else {
            this.localUser.stats = stats;
            this.localUser.connType = connType;
        }
    }

    onSessionStart(data: any) {
        this.room = data.room;
        // tslint:disable-next-line:forin
        for (const trackType in this.localUser.tracks) {
            this.streamingService.addTrackToRoom(
                this.room,
                this.localUser.tracks[trackType]
            );
        }
        this.localUser.id = this.streamingService.getMyUserId(this.room);
        this.onSelectRemoteUser(this.localUser.id);
        this.classJoin.emit(true);
    }

    onConferenceTime(timestamp) {
        this.timerIntervalSub$ = this.streamingService
            .startTimer(timestamp)
            .subscribe((duration) => {
                this.timerDuration = duration;
            });
    }

    onLocalTracks(tracks) {
        for (const track of tracks) {
            const trackType = track.getType();
            this.localUser.tracks[trackType] = track;
            const element = document.getElementById(`local_${trackType}`);
            element['volume'] = 0;
            this.localUser.tracks[trackType].attach(element);
        }
    }

    onRemoteTrack(track: any) {
        if (track.isLocal()) {
            return;
        }
        this.subcRemoteEvents(track);
        const userId = track.getParticipantId();
        if (this.users[userId]) {
            if (!this.users[userId].tracks) {
                this.users[userId].tracks = [];
            }
            this.setRemoteTrack(track);
            const elementById = `${userId}_${track.getType()}`;
            const element = document.getElementById(elementById);
            track.detach(element);
            track.attach(element);
        }
    }

    subcRemoteEvents(track: any) {
        this.remoteEventSub$ = this.streamingService
            .subcRemoteEvents(track)
            .subscribe((response) => {
                switch (response.event) {
                    case SessionEvents.TRACK_MUTE_CHANGED:
                        this.setRemoteTrack(response.data.track);
                        break;
                    default:
                        break;
                }
            });
    }

    setRemoteTrack(track: any) {
        const participantId = track.getParticipantId();
        if (track.getType() === this.mediaTracksEnum.VIDEO) {
            this.users[participantId].tracks[1] = track;
            if (participantId === this.centerViewDetail.id) {
                this.attachCenterTrack(track);
            }
        } else {
            this.users[participantId].tracks[0] = track;
        }
    }

    attachCenterTrack(track) {
        this.centerViewDetail['track'] = track;
        const element = document.getElementById(
            'center_' + this.mediaTracksEnum.VIDEO
        );
        track.detach(element);
        track.attach(element);
    }

    leave() {
        if (this.room) {
            this.timerDuration = '--:--:--';
            this.streamingService.stopTimer();
            this.streamingService.unlinkTracks(
                this.room,
                this.users,
                this.localUser.tracks
            );
            this.streamingService.leave(this.room);
            this.unsubSessionEvents();
            this.room = null;
            this.users = {};
            this.providerUserId = null;
        }
        if (this.isFullScreen) {
            this.onToggleFullScreen();
            this.fullScreenAction(false);
        }
    }

    unsubSessionEvents() {
        if (this.timerIntervalSub$) {
            this.timerIntervalSub$.unsubscribe();
            this.timerIntervalSub$ = null;
        }
        if (this.remoteEventSub$) {
            this.remoteEventSub$.unsubscribe();
            this.remoteEventSub$ = null;
        }
        if (this.startSessionSub$) {
            this.startSessionSub$.unsubscribe();
            this.startSessionSub$ = null;
        }
        this.unSubsSwitchDisplay();
    }

    disconnect() {
        if (this.connection) {
            this.stopRecording();
            this.leave();
            this.streamingService.disconnect(this.connection);
            this.connection = null;
            this.currentConnectionState = this.connectionState.DISCONNECTED;
            this.unsubConnEvents();
        }
    }

    callEnd() {
        this.disconnect();
        this.endStreaming.emit(true);
    }

    unsubConnEvents() {
        if (this.connectionSubs$) {
            this.connectionSubs$.unsubscribe();
            this.connectionSubs$ = null;
        }
        if (this.onlineSubs$) {
            this.onlineSubs$.unsubscribe();
            this.onlineSubs$ = null;
        }
    }

    onUserJoin(id: string, user: any) {
        if (
            !this.remoteLeftUsers[id] &&
            user._statsID !== WEB_RTC_STATS.JIBRI
        ) {
            const userName = user._displayName || 'Fellow student';
            const splitDPName = userName.split(' ');
            let phChar = splitDPName[0].charAt(0).toUpperCase();
            if (splitDPName.length > 1) {
                phChar =
                    splitDPName[0].charAt(0).toUpperCase() +
                    splitDPName[1].charAt(0).toUpperCase();
            }
            const notificationTxt = `${userName} has joined the session`;
            this.sharedService.setSnackBar(notificationTxt);
            this.users[id] = {
                display_name: userName,
                role: user._role,
                status: user._connectionStatus,
                ph_char: phChar
            };
            if (user._role === WebRTCUserRole.Moderator) {
                this.providerUserId = id;
            }
        }
    }

    onUserLeft(id: string, user: any) {
        if (!this.users[id]) {
            return;
        }
        const userName = user._displayName || 'Fellow student';
        const notificationTxt = `${userName} has left the session`;
        this.sharedService.setSnackBar(notificationTxt);
        this.remoteLeftUsers[id] = true;
        this.sharedService.setSnackBar(notificationTxt);
        this.streamingService.removeTracks(id, this.users[id].tracks);
        if (this.users[id].role === WebRTCUserRole.Moderator) {
            this.disconnect();
        }
        delete this.users[id];
        if (this.centerViewDetail.id === id) {
            this.onSelectRemoteUser(this.localUser.id);
        }
    }

    onRoleChanged(id: string, role: string) {
        if (this.users[id]) {
            this.users[id].role = role;
            if (this.providerUserId && this.providerUserId !== id) {
                delete this.users[this.providerUserId];
            }
            if (role === WebRTCUserRole.Moderator) {
                this.providerUserId = id;
            }
        } else if (!this.users[id] && role === WebRTCUserRole.Moderator) {
            this.streamingService.setMutedPolicy(this.room);
        }
    }

    onDisplayNameChanged(id: string, displayName: string) {
        this.users[id].display_name = displayName;
        this.users[id].ph_char = displayName.charAt(0).toUpperCase();
        this.centerViewDetail.ph_char = this.users[id].ph_char;
    }

    onMsgReceived(data: any, isPrivate: boolean) {
        const user = this.users[data.id];
        this.messagesArray.push({
            id: data.id ? data.id : null,
            msg: data.msg,
            isPrivate,
            sender_name: user ? user.display_name : 'me',
            created_at: new Date()
        });
        if (user && this.activeView !== Views.CHAT_VIEW) {
            this.msgBadgeCount++;
        }
    }

    screenShare() {
        this.unSubsSwitchDisplay();
        if (!this.isVideo) {
            this.handleTrackChange(
                this.mediaTracksEnum.DESKTOP,
                this.localUser.tracks[this.mediaTracksEnum.VIDEO]
            );
            return;
        }
        this.switchDisplaySubs$ = this.streamingService
            .createDesktopTrack()
            .subscribe((response) => {
                switch (response.event) {
                    case SessionEvents.LOCAL_TRACK_CHANGED:
                        this.handleTrackChange(
                            this.mediaTracksEnum.VIDEO,
                            response.data.track
                        );
                        break;
                    case SessionEvents.LOCAL_TRACK_STOPPED:
                        this.handleTrackChange(
                            this.mediaTracksEnum.DESKTOP,
                            this.localUser.tracks[this.mediaTracksEnum.VIDEO]
                        );
                        break;
                }
            });
    }

    async handleTrackChange(oldTrackType, newTrack) {
        const tileElement = document.getElementById('local_video');
        const oldTrack = this.localUser.tracks[oldTrackType];

        this.streamingService.detachTrack(oldTrack, tileElement);
        await this.streamingService.removeTrackFromRoom(this.room, oldTrack);

        this.streamingService.atttachTrack(newTrack, tileElement);
        this.streamingService.addTrackToRoom(this.room, newTrack);

        switch (oldTrackType) {
            case this.mediaTracksEnum.DESKTOP:
                delete this.localUser.tracks[oldTrackType];
                await this.streamingService.disposeTrack(oldTrack);
                break;
            case this.mediaTracksEnum.VIDEO:
                this.localUser.tracks[this.mediaTracksEnum.DESKTOP] = newTrack;
                break;
            default:
                break;
        }

        if (!this.centerViewDetail.id) {
            this.attachCenterTrack(newTrack);
        }
        this.isVideo = !this.isVideo;
    }

    async startRecording() {
        try {
            this.recSession = await this.streamingService.startRecording(
                this.room
            );
        } catch (error) {
            this.sharedService.setSnackBar('failed to start recording');
        }
    }

    stopRecording() {
        if (this.recSession) {
            this.streamingService.stopRecording(
                this.room,
                this.recSession._sessionID
            );
            this.recSession = null;
        }
    }

    onMute(trackType: MediaTracksEnum) {
        if (trackType === MediaTracksEnum.VIDEO && !this.isVideo) {
            return;
        }
        const track = this.localUser.tracks[trackType];
        this.streamingService.onMute(track);
    }

    // To send message in the group
    onSendMsg(msg: string) {
        this.streamingService.sendGroupMsg(this.room, msg);
    }

    onSendPersonalMsg(msg: string, id: string) {
        this.streamingService.sendPrivateMessage(this.room, id, msg);
        const messageObj = {
            id: null,
            msg,
            isPrivate: true,
            senderId: id,
            sender_name: 'me'
        };
        this.messagesArray.push(messageObj);
    }

    onSelectRemoteUser(userId: string) {
        if (userId && this.centerViewDetail.id === userId) {
            return;
        }

        let videoTrack: any;
        const element = document.getElementById(
            'center_' + this.mediaTracksEnum.VIDEO
        );
        if (this.centerViewDetail['track']) {
            this.centerViewDetail['track'].detach(element);
            delete this.centerViewDetail['track'];
        }
        if (!userId || userId === this.localUser.id) {
            videoTrack = this.isVideo
                ? this.localUser.tracks[this.mediaTracksEnum.VIDEO]
                : this.localUser.tracks[this.mediaTracksEnum.DESKTOP];
            this.centerViewDetail.ph_char = this.localUser.ph_char;
        } else {
            const tracks = this.users[userId].tracks;
            if (tracks && tracks[1]) {
                videoTrack = tracks[1];
            }
            this.centerViewDetail.ph_char = this.users[userId].ph_char;
            this.streamingService.electParticipant(this.room, userId);
        }
        this.centerViewDetail.id = userId;
        if (videoTrack) {
            videoTrack.attach(element);
            this.centerViewDetail['track'] = videoTrack;
        }
    }

    unSubsSwitchDisplay() {
        if (this.switchDisplaySubs$) {
            this.switchDisplaySubs$.unsubscribe();
            this.switchDisplaySubs$ = null;
        }
    }

    onChangeChat(flag) {
        switch (flag) {
            case 0:
                this.msgBadgeCount = 0;
                this.activeView = this.htmlView.CHAT_VIEW;
                break;
            default:
                break;
        }
    }

    onCloseChatBar(event: any) {
        this.activeView = null;
    }

    onUserViewChange = () => {
        this.isTotalStudentView = false;
        this.isGridView = !this.isGridView;
        this.isShowStudents = true;
    };

    onTotalStudentView = () => {
        if (Object.keys(this.users).length > 1) {
            this.isGridView = false;
            this.isTotalStudentView = !this.isTotalStudentView;
            this.isShowStudents = true;
        }
    };

    onMuteAll() {
        const participants = this.room.participants;
        // tslint:disable-next-line:forin
        for (const userId in participants) {
            this.room.muteParticipant(userId);
        }
    }

    onMouseMove(event) {
        this.isShowActions = true;
        clearTimeout(this.timeCount);
        this.timeCount = setTimeout(() => {
            this.isShowActions = false;
        }, 5000);
    }

    onToggleStudents() {
        this.isShowStudents = !this.isShowStudents;
    }

    @HostListener('document:fullscreenchange', ['$event'])
    @HostListener('document:webkitfullscreenchange', ['$event'])
    @HostListener('document:mozfullscreenchange', ['$event'])
    onFullScreenChange() {
        this.isFullScreen = !this.isFullScreen;
        this.fullScreenAction(this.isFullScreen);
    }

    fullScreenAction(flag) {
        const panel = document.getElementsByClassName('panel')[0];
        const streamingContainer = document.getElementsByClassName(
            'streaming-container'
        )[0];
        const streamingBody = document.getElementsByClassName(
            'streaming-container__body'
        )[0];
        const videoContainer = document.getElementsByClassName(
            'video-container'
        )[0];
        const chatContainerBody = document.getElementsByClassName(
            'chat-container__bottom--body'
        )[0];
        if (flag) {
            if (this.sidebarElem) {
                this.sidebarElem.style.display = 'none';
            }
            if (this.headerElem) {
                this.headerElem.style.display = 'none';
            }

            if (panel && panel.classList) {
                panel.classList.add('panel-full-screen');
            }

            if (streamingContainer && streamingContainer.classList) {
                streamingContainer.classList.add(
                    'streaming-container-full-screen'
                );
            }

            if (streamingBody && streamingBody.classList) {
                streamingBody.classList.add(
                    'streaming-container__body--full-screen'
                );
            }

            if (videoContainer && videoContainer.classList) {
                videoContainer.classList.add('video-container--full-screen');
            }

            if (chatContainerBody && chatContainerBody.classList) {
                chatContainerBody.classList.add(
                    'chat-container__bottom--body--full-screen'
                );
            }
        } else {
            if (this.sidebarElem) {
                this.sidebarElem.style.display = 'block';
            }
            if (this.headerElem) {
                this.headerElem.style.display = 'block';
            }

            if (panel && panel.classList) {
                panel.classList.remove('panel-full-screen');
            }

            if (streamingContainer && streamingContainer.classList) {
                streamingContainer.classList.remove(
                    'streaming-container-full-screen'
                );
            }

            if (streamingBody && streamingBody.classList) {
                streamingBody.classList.remove(
                    'streaming-container__body--full-screen'
                );
            }

            if (videoContainer && videoContainer.classList) {
                videoContainer.classList.remove('video-container--full-screen');
            }

            if (chatContainerBody && chatContainerBody.classList) {
                chatContainerBody.classList.remove(
                    'chat-container__bottom--body--full-screen'
                );
            }
        }
    }

    onToggleFullScreen() {
        const elem = document.getElementById('body') as FsDocumentElement;
        if (this.isFullScreen) {
            const doc = document as FsDocument;
            const requestExitFullScreen =
                doc.exitFullscreen ||
                doc.msExitFullscreen ||
                doc.mozCancelFullScreen;
            requestExitFullScreen.apply(document);
        } else {
            // tslint:disable-next-line: max-line-length
            const requestFullScreen =
                elem.requestFullscreen ||
                elem.msRequestFullscreen ||
                elem.mozRequestFullScreen;
            requestFullScreen.call(elem);
        }
    }

    showHandRaise() {
        this.handRaise.emit(true);
    }

    ngOnDestroy(): void {
        this.unloadHandler(null);
        if (this.isFullScreen) {
            this.sidebarElem.style.display = 'block';
            this.headerElem.style.display = 'block';
        }
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadHandler(event: any) {
        this.disconnect();
    }
}
