export interface StudentSessionHistoryModel {
    totalDuration: number;
    sessions: SessionModel[];
}

export interface SessionModel {
    id: number;
    uuid: string;
    joined_at: string;
    leaved_at: string;
    duration: number;
}
