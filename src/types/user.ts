export interface IUser {
    id: string;
    email: string;
    name: string;
    claimTime?: Date;

}

export interface IDeleteUserBody {
    phase: string,
    ids: Array<string>
}

export interface IQueryPhaseResult {
    phase: string,
}

export interface Iquery {
    eqpid: string
}

export interface IUsers {
    users: Array<IUser>

}